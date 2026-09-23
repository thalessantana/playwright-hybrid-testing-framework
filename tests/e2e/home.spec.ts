import { test, expect } from "@fixtures/index";

test.describe("Home Page", () => {
  test.beforeEach(async ({ homePage }) => {
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

    const articleCount = await homePage.articleFeed.getArticleCount();
    expect(articleCount).toBeGreaterThan(0);
  });

  test("should display popular tags in sidebar", async ({ homePage }) => {
    const tags = await homePage.getPopularTags();
    expect(tags.length).toBeGreaterThan(0);
  });

  test("should filter articles by clicking a popular tag", async ({
    homePage,
  }) => {
    const tags = await homePage.getPopularTags();
    expect(tags.length).toBeGreaterThan(0);

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
