import type { Locator, Page } from "@playwright/test";
import { ArticleFeedComponent } from "@components/ArticleFeedComponent";

export class ProfilePage {
  private readonly page: Page;
  private readonly userInfo: Locator;
  private readonly articlesToggle: Locator;

  readonly userImage: Locator;
  readonly username: Locator;
  readonly bio: Locator;
  readonly editProfileSettingsLink: Locator;

  readonly myPostsTab: Locator;
  readonly favoritedPostsTab: Locator;

  readonly articleFeed: ArticleFeedComponent;

  constructor(page: Page) {
    this.page = page;
    this.userInfo = page.locator(".user-info");
    this.articlesToggle = page.locator(".articles-toggle");

    this.userImage = this.userInfo.locator(".user-img");
    this.username = this.userInfo.getByRole("heading");
    this.bio = this.userInfo.locator("p");
    this.editProfileSettingsLink = this.userInfo.getByRole("link", {
      name: /edit profile settings/i,
    });

    this.myPostsTab = this.articlesToggle.getByRole("link", {
      name: "My Posts",
    });
    this.favoritedPostsTab = this.articlesToggle.getByRole("link", {
      name: "Favorited Posts",
    });

    this.articleFeed = new ArticleFeedComponent(page);
  }

  async goto(username: string): Promise<void> {
    await this.page.goto(`/profile/${username}`);
  }

  async clickMyPosts(): Promise<void> {
    await this.myPostsTab.click();
  }

  async clickFavoritedPosts(): Promise<void> {
    await this.favoritedPostsTab.click();
  }

  async clickEditProfileSettings(): Promise<void> {
    await this.editProfileSettingsLink.click();
  }

  async getUsernameText(): Promise<string> {
    return (await this.username.textContent())?.trim() ?? "";
  }

  async getBioText(): Promise<string> {
    return (await this.bio.textContent())?.trim() ?? "";
  }
}
