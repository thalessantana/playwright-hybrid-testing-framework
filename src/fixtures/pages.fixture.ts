import {
  apiFixture,
  type ApiFixtures,
  type AuthenticatedUser,
} from "./api.fixture";
import { NavbarComponent } from "@components/NavbarComponent";
import { ArticleFeedComponent } from "@components/ArticleFeedComponent";
import { AuthPage } from "@pages/AuthPage";
import { HomePage } from "@pages/HomePage";
import { ArticleEditorPage } from "@pages/ArticleEditorPage";
import { ArticlePage } from "@pages/ArticlePage";
import { ProfilePage } from "@pages/ProfilePage";
import { ProfileSettingsPage } from "@pages/ProfileSettingsPage";

export type PageFixtures = {
  navbar: NavbarComponent;
  articleFeed: ArticleFeedComponent;
  authPage: AuthPage;
  homePage: HomePage;
  articleEditorPage: ArticleEditorPage;
  articlePage: ArticlePage;
  profilePage: ProfilePage;
  profileSettingsPage: ProfileSettingsPage;
};

export type HybridFixtures = PageFixtures & ApiFixtures;
export type { AuthenticatedUser };

/**
 * Extended Playwright test with page object fixtures and authenticated API clients.
 * Import test from this fixture instead of @playwright/test to get typed page objects and API clients.
 */
export const test = apiFixture.extend<PageFixtures>({
  navbar: async ({ page }, use) => {
    await use(new NavbarComponent(page));
  },

  articleFeed: async ({ page }, use) => {
    await use(new ArticleFeedComponent(page));
  },

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  articleEditorPage: async ({ page }, use) => {
    await use(new ArticleEditorPage(page));
  },

  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },

  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },

  profileSettingsPage: async ({ page }, use) => {
    await use(new ProfileSettingsPage(page));
  },
});
