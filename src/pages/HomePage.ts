import type { Locator, Page } from "@playwright/test";
import { ArticleFeedComponent } from "@components/ArticleFeedComponent";

export class HomePage {
  private readonly page: Page;
  readonly feedToggle: Locator;
  private readonly sidebar: Locator;

  readonly yourFeedTab: Locator;
  readonly globalFeedTab: Locator;
  readonly articleFeed: ArticleFeedComponent;
  readonly popularTags: Locator;

  constructor(page: Page) {
    this.page = page;
    this.feedToggle = page.locator(".feed-toggle");
    this.sidebar = page.locator(".sidebar");

    this.yourFeedTab = this.feedToggle.getByText("Your Feed");
    this.globalFeedTab = this.feedToggle.getByText("Global Feed");
    this.popularTags = this.sidebar.locator(".tag-list a");
    this.articleFeed = new ArticleFeedComponent(page);
  }

  async goto(): Promise<void> {
    await this.page.goto("/");
  }

  async clickYourFeed(): Promise<void> {
    await this.yourFeedTab.click();
  }

  async clickGlobalFeed(): Promise<void> {
    await this.globalFeedTab.click();
  }

  getPopularTag(tagName: string): Locator {
    return this.sidebar
      .locator(".tag-list")
      .getByText(tagName, { exact: true });
  }

  async clickPopularTag(tagName: string): Promise<void> {
    await this.getPopularTag(tagName).click();
  }

  async getPopularTags(): Promise<string[]> {
    await this.popularTags.first().waitFor({ state: "visible" });
    const tags = await this.popularTags.allTextContents();
    return tags.map((tag) => tag.trim());
  }
}
