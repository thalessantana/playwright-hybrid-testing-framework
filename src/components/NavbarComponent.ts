import type { Locator, Page } from "@playwright/test";

export class NavbarComponent {
  private readonly page: Page;
  private readonly root: Locator;

  readonly brandLink: Locator;
  readonly homeLink: Locator;
  readonly signInLink: Locator;
  readonly signUpLink: Locator;

  readonly newArticleLink: Locator;
  readonly settingsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.getByRole("navigation");

    this.brandLink = this.root.getByRole("link", { name: /conduit/i });
    this.homeLink = this.root.getByRole("link", { name: /home/i });
    this.signInLink = this.root.getByRole("link", { name: /sign in/i });
    this.signUpLink = this.root.getByRole("link", { name: /sign up/i });

    this.newArticleLink = this.root.getByRole("link", { name: /new article/i });
    this.settingsLink = this.root.getByRole("link", { name: /settings/i });
    this.currentUserProfileLink = this.root.locator("a.nav-link", {
      has: this.page.locator(".user-pic"),
    });
  }

  readonly currentUserProfileLink: Locator;

  async getLoggedInUsername(): Promise<string> {
    const text = await this.currentUserProfileLink.innerText();
    return text.trim();
  }

  getUserProfileLink(username: string): Locator {
    return this.root.getByRole("link", { name: username });
  }

  async clickBrand(): Promise<void> {
    await this.brandLink.click();
  }

  async clickHome(): Promise<void> {
    await this.homeLink.click();
  }

  async clickNewArticle(): Promise<void> {
    await this.newArticleLink.click();
  }

  async clickSettings(): Promise<void> {
    await this.settingsLink.click();
  }

  async clickSignIn(): Promise<void> {
    await this.signInLink.click();
  }

  async clickSignUp(): Promise<void> {
    await this.signUpLink.click();
  }

  async clickProfile(username: string): Promise<void> {
    await this.getUserProfileLink(username).click();
  }
}
