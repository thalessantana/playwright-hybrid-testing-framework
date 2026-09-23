import { test, expect } from "@fixtures/index";
import { generateCreateArticleData } from "@factories/article.factory";

test.describe("Home Page", () => {
  test.beforeEach(async ({ homePage, articlesApi }) => {
    const articleData = generateCreateArticleData();
    const createRes = await articlesApi.createArticle({ article: articleData });
    expect(createRes.status()).toBe(201);

    await homePage.goto();
  });

  test("should display Your Feed and Global Feed tabs", async ({
    homePage,
  }) => {
    await expect(homePage.yourFeedTab).toBeVisible();
    await expect(homePage.globalFeedTab).toBeVisible();
  });

  test("should display articles in global feed", async ({ homePage }) => {
    await homePage.clickGlobalFeed();

    await expect(homePage.articleFeed.getAllPreviews().first()).toBeVisible();
  });

  test("should display popular tags in sidebar", async ({ homePage }) => {
    await expect(homePage.popularTags.first()).toBeVisible();
  });

  test("should filter articles by clicking a popular tag", async ({
    homePage,
  }) => {
    const tags = await homePage.getPopularTags();
    await homePage.clickPopularTag(tags[0]);

    await expect(homePage.feedToggle).toContainText(tags[0]);
  });

  test("should switch between feed tabs", async ({ homePage }) => {
    await homePage.clickYourFeed();
    await expect(homePage.yourFeedTab).toHaveClass(/active/);

    await homePage.clickGlobalFeed();
    await expect(homePage.globalFeedTab).toHaveClass(/active/);
  });

  test("should display article preview with author, date and favorite button", async ({
    homePage,
  }) => {
    await homePage.clickGlobalFeed();

    const firstArticle = homePage.articleFeed.getFirstArticle();
    await expect(firstArticle.title).toBeVisible();
    await expect(firstArticle.authorName).toBeVisible();
    await expect(firstArticle.date).toBeVisible();
    await expect(firstArticle.favoriteButton).toBeVisible();
  });
});
