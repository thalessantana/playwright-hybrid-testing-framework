import { test, expect } from "@fixtures/index";
import {
  generateCreateArticleData,
  generateUpdateArticleData,
} from "@factories/article.factory";
import { faker } from "@faker-js/faker";

test.describe("Full E2E Journey", () => {
  test.describe.configure({ timeout: 60_000 });

  test("should complete a full user journey across all pages", async ({
    page,
    navbar,
    homePage,
    articleEditorPage,
    articlePage,
    profilePage,
    profileSettingsPage,
  }) => {
    await homePage.goto();
    await expect(homePage.globalFeedTab).toBeVisible();
    await expect(homePage.yourFeedTab).toBeVisible();

    const username = await navbar.getLoggedInUsername();

    await navbar.clickNewArticle();
    const articleData = generateCreateArticleData();
    await articleEditorPage.createArticle(articleData);

    await expect(articlePage.articleTitle).toHaveText(articleData.title);
    await expect(articlePage.authorName).toHaveText(username);

    const tags = await articlePage.getTags();
    for (const tag of articleData.tagList ?? []) {
      expect(tags).toContain(tag);
    }

    const commentText = "E2E journey comment - " + Date.now();
    await articlePage.postComment(commentText);
    await expect(articlePage.getCommentCard(commentText)).toBeVisible();

    const slug = page.url().split("/article/")[1];
    await articleEditorPage.gotoEditArticlePage(slug);
    const updateData = generateUpdateArticleData();
    await articleEditorPage.updateArticle(updateData);
    await expect(articlePage.articleTitle).toHaveText(updateData.title!);

    await profilePage.goto(username);
    await expect(profilePage.username).toHaveText(username);
    await expect(profilePage.myPostsTab).toHaveClass(/active/);

    const myArticle = profilePage.articleFeed.getArticle(updateData.title!);
    await expect(myArticle.title).toBeVisible();

    await homePage.goto();
    await homePage.clickGlobalFeed();
    const communityArticle = homePage.articleFeed.getFirstArticle();
    await communityArticle.clickFavorite();

    await profilePage.goto(username);
    await profilePage.clickFavoritedPosts();
    await expect(profilePage.favoritedPostsTab).toHaveClass(/active/);

    const newBio = "E2E journey bio - " + faker.lorem.sentence();
    await profileSettingsPage.goto();
    await profileSettingsPage.updateSettings({ bio: newBio });

    await expect(profilePage.bio).toContainText(newBio);

    await navbar.clickBrand();
    await expect(homePage.globalFeedTab).toBeVisible();
  });
});
