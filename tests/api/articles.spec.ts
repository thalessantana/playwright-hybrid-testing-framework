import { test } from "@playwright/test";
import { expect } from "@fixtures/index";
import { ArticlesApi } from "@api/clients/articles.api";
import { AuthApi } from "@api/clients/auth.api";
import {
  generateCreateArticlePayload,
  generateUpdateArticlePayload,
} from "@api/factories/article.factory";
import { generateCreateUserPayload } from "@api/factories/user.factory";
import {
  ArticleResponseSchema,
  ArticlesResponseSchema,
  type ArticleResponse,
} from "@api/schemas/article.schema";

test.describe("REST API: Articles Full Operations Suite", () => {
  let articlesApi: ArticlesApi;
  let authToken: string;

  test.beforeAll(async ({ playwright }) => {
    const request = await playwright.request.newContext();
    const authApi = new AuthApi(request);

    const userPayload = generateCreateUserPayload();
    const authResponse = await authApi.register(userPayload);
    expect(authResponse.status()).toBe(201);

    const authBody = await authResponse.json();
    authToken = authBody.user.token;
    await request.dispose();
  });

  test.beforeEach(async ({ request }) => {
    articlesApi = new ArticlesApi(request, authToken);
  });

  test("createArticle: should create article and validate schema and payload", async () => {
    const payload = generateCreateArticlePayload();
    const response = await articlesApi.createArticle(payload);
    expect(response.status()).toBe(201);

    const body: ArticleResponse = await response.json();
    const slug = body?.article?.slug;

    try {
      expect(body).toMatchSchema(ArticleResponseSchema);
      expect(body.article.title).toBe(payload.article.title);
      expect(body.article.description).toBe(payload.article.description);
    } finally {
      if (slug) {
        await articlesApi.deleteArticle(slug);
      }
    }
  });

  test("getArticle: should fetch specific article by slug", async () => {
    const payload = generateCreateArticlePayload();
    const createRes = await articlesApi.createArticle(payload);
    const created: ArticleResponse = await createRes.json();
    const slug = created?.article?.slug;

    try {
      const response = await articlesApi.getArticle(slug);
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toMatchSchema(ArticleResponseSchema);
      expect(body.article.slug).toBe(slug);
    } finally {
      if (slug) {
        await articlesApi.deleteArticle(slug);
      }
    }
  });

  test("listArticles: should list articles filtered by dynamic tag", async () => {
    const uniqueTag = `tag-${Date.now()}`;
    const payload = generateCreateArticlePayload({ tagList: [uniqueTag] });
    const createRes = await articlesApi.createArticle(payload);
    const created: ArticleResponse = await createRes.json();
    const slug = created?.article?.slug;

    try {
      const response = await articlesApi.listArticles({
        tag: uniqueTag,
        limit: 1,
      });
      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body).toMatchSchema(ArticlesResponseSchema);
      expect(body.articlesCount).toBeGreaterThanOrEqual(1);
      expect(body.articles[0].slug).toBe(slug);
    } finally {
      if (slug) {
        await articlesApi.deleteArticle(slug);
      }
    }
  });

  test("updateArticle: should update title and reflect changes in contract", async () => {
    const createPayload = generateCreateArticlePayload();
    const createRes = await articlesApi.createArticle(createPayload);
    const created: ArticleResponse = await createRes.json();

    let targetSlug = created?.article?.slug;

    try {
      const updatePayload = generateUpdateArticlePayload();
      const updateRes = await articlesApi.updateArticle(
        targetSlug,
        updatePayload,
      );
      expect(updateRes.status()).toBe(200);

      const updatedBody: ArticleResponse = await updateRes.json();
      if (updatedBody?.article?.slug) {
        targetSlug = updatedBody.article.slug;
      }

      expect(updatedBody).toMatchSchema(ArticleResponseSchema);
      expect(updatedBody.article.title).toBe(updatePayload.article.title);
      expect(updatedBody.article.body).toBe(updatePayload.article.body);
    } finally {
      if (targetSlug) {
        await articlesApi.deleteArticle(targetSlug);
      }
    }
  });

  test("favoriteArticle and unfavoriteArticle: should cycle article favorite status", async () => {
    const payload = generateCreateArticlePayload();
    const createRes = await articlesApi.createArticle(payload);
    const created: ArticleResponse = await createRes.json();
    const slug = created?.article?.slug;

    try {
      const favRes = await articlesApi.favoriteArticle(slug);
      expect(favRes.status()).toBe(200);

      const favBody = await favRes.json();
      expect(favBody).toMatchSchema(ArticleResponseSchema);
      expect(favBody.article.favorited).toBe(true);

      const unfavRes = await articlesApi.unfavoriteArticle(slug);
      expect(unfavRes.status()).toBe(200);

      const unfavBody = await unfavRes.json();
      expect(unfavBody).toMatchSchema(ArticleResponseSchema);
      expect(unfavBody.article.favorited).toBe(false);
    } finally {
      if (slug) {
        await articlesApi.deleteArticle(slug);
      }
    }
  });

  test("deleteArticle: should delete article and return 404 on subsequent lookups", async () => {
    const payload = generateCreateArticlePayload();
    const createRes = await articlesApi.createArticle(payload);
    const created: ArticleResponse = await createRes.json();
    const slug = created.article.slug;

    const deleteRes = await articlesApi.deleteArticle(slug);
    expect(deleteRes.status()).toBe(204);

    const getRes = await articlesApi.getArticle(slug);
    expect(getRes.status()).toBe(404);
  });
});
