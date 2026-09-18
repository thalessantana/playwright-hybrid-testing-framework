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
    this.root = page.locator("nav.navbar");

    this.brandLink = this.root.getByRole("link", { name: "conduit" });
    this.homeLink = this.root.getByRole("link", { name: "Home" });
    this.signInLink = this.root.getByRole("link", { name: "Sign in" });
    this.signUpLink = this.root.getByRole("link", { name: "Sign up" });

    this.newArticleLink = this.root.getByRole("link", { name: /new article/i });
    this.settingsLink = this.root.getByRole("link", { name: /settings/i });
  }
  
  getUserProfileLink(username: string): Locator {
    return this.root.getByRole("link", { name: username });
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