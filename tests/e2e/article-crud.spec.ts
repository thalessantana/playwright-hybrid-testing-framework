import { test, expect } from "@fixtures/index";
import {
  generateCreateArticleData,
  generateUpdateArticleData,
} from "@factories/article.factory";
import { generateCreateUserPayload } from "@factories/user.factory";
import { ArticlesApi } from "@api/clients/articles.api";

test.describe("Article CRUD (UI)", () => {
  test("should create a new article and verify on article page", async ({
    articleEditorPage,
    articlePage,
  }) => {
    const articleData = generateCreateArticleData();

    await articleEditorPage.goto();
    await articleEditorPage.createArticle(articleData);

    await expect(articlePage.articleTitle).toHaveText(articleData.title);

    const tags = await articlePage.getTags();
    for (const tag of articleData.tagList ?? []) {
      expect(tags).toContain(tag);
    }
  });

  test.describe("Existing Article Operations (API Bypass)", () => {
    let articleSlug: string;

    test.beforeEach(async ({ articlesApi }) => {
      const articleData = generateCreateArticleData();
      const createRes = await articlesApi.createArticle({
        article: articleData,
      });
      expect(createRes.status()).toBe(201);
      const { article } = await createRes.json();
      articleSlug = article.slug;
    });

    test("should edit an existing article and verify changes", async ({
      articleEditorPage,
      articlePage,
    }) => {
      await articleEditorPage.gotoEditArticlePage(articleSlug);

      const updateData = generateUpdateArticleData();
      await articleEditorPage.updateArticle(updateData);

      await expect(articlePage.articleTitle).toHaveText(updateData.title!);
    });

    test("should post a comment on an article", async ({ articlePage }) => {
      await articlePage.goto(articleSlug);

      const commentText = "Playwright test comment - " + Date.now();
      await articlePage.postComment(commentText);

      await expect(articlePage.getCommentCard(commentText)).toBeVisible();
    });

    test("should delete a comment from an article", async ({ articlePage }) => {
      await articlePage.goto(articleSlug);

      const commentText = "Comment to delete - " + Date.now();
      await articlePage.postComment(commentText);
      await expect(articlePage.getCommentCard(commentText)).toBeVisible();

      await articlePage.deleteComment(commentText);
      await expect(articlePage.getCommentCard(commentText)).toBeHidden();
    });

    test("should favorite and unfavorite an article", async ({
      apiContext,
      authApi,
      articlePage,
    }) => {
      const authorPayload = generateCreateUserPayload();
      const authorRes = await authApi.register(authorPayload);
      const { user: authorUser } = await authorRes.json();

      const otherUserArticlesApi = new ArticlesApi(
        apiContext,
        authorUser.token,
      );
      const articleData = generateCreateArticleData();
      const createRes = await otherUserArticlesApi.createArticle({
        article: articleData,
      });
      const { article } = await createRes.json();

      await articlePage.goto(article.slug);

      await articlePage.clickFavorite();
      await expect(articlePage.favoriteButton).toContainText(
        "Unfavorite Article",
      );

      await articlePage.clickFavorite();
      await expect(articlePage.favoriteButton).toContainText(
        "Favorite Article",
      );
    });
  });
});
