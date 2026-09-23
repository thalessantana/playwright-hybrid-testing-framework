import { test, expect } from "@fixtures/index";
import { generateCreateArticleData } from "@factories/article.factory";

test.describe("Profile Page", () => {
  test.beforeEach(async ({ profilePage, authenticatedUser }) => {
    await profilePage.goto(authenticatedUser.username);
  });

  test("should display user profile information", async ({
    profilePage,
    authenticatedUser,
  }) => {
    await expect(profilePage.username).toHaveText(authenticatedUser.username);
    await expect(profilePage.userImage).toBeVisible();
    await expect(profilePage.editProfileSettingsLink).toBeVisible();
  });

  test("should display My Posts tab as active by default", async ({
    profilePage,
  }) => {
    await expect(profilePage.myPostsTab).toHaveClass(/active/);
  });

  test("should switch to Favorited Posts tab", async ({ profilePage }) => {
    await profilePage.clickFavoritedPosts();

    await expect(profilePage.favoritedPostsTab).toHaveClass(/active/);
  });

  test("should navigate to settings from profile", async ({
    profilePage,
    page,
  }) => {
    await profilePage.clickEditProfileSettings();

    await expect(page).toHaveURL(/\/settings/);
  });

  test.describe("Profile Articles Feed (API Bypass)", () => {
    let articleData: ReturnType<typeof generateCreateArticleData>;

    test.beforeEach(async ({ articlesApi, profilePage, authenticatedUser }) => {
      articleData = generateCreateArticleData();
      const createRes = await articlesApi.createArticle({
        article: articleData,
      });
      expect(createRes.status()).toBe(201);

      await profilePage.goto(authenticatedUser.username);
    });

    test("should display created article in My Posts", async ({
      profilePage,
    }) => {
      const article = profilePage.articleFeed.getArticle(articleData.title);
      await expect(article.title).toBeVisible();
    });
  });
});
