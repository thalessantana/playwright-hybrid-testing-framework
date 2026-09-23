import type { Locator, Page } from "@playwright/test";

export class ArticlePreviewComponent {
  private readonly root: Locator;

  readonly title: Locator;
  readonly authorName: Locator;
  readonly authorImage: Locator;
  readonly date: Locator;
  readonly description: Locator;
  readonly tags: Locator;
  readonly favoriteButton: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.title = root.getByRole("heading");
    this.authorName = root.locator(".info").getByRole("link");
    this.authorImage = root.locator(".article-meta img");
    this.date = root.locator(".info .date");
    this.description = root.locator(".preview-link p");
    this.tags = root.locator(".tag-list li");
    this.favoriteButton = root
      .locator("app-favorite-button")
      .getByRole("button");
  }

  async click(): Promise<void> {
    await this.root.locator(".preview-link").click();
  }

  async clickAuthor(): Promise<void> {
    await this.authorName.click();
  }

  async clickFavorite(): Promise<void> {
    await this.favoriteButton.click();
  }

  async getTagTexts(): Promise<string[]> {
    const tags = await this.tags.allTextContents();
    return tags.map((tag) => tag.trim());
  }
}

export class ArticleFeedComponent {
  private readonly page: Page;
  private readonly root: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page.locator("app-article-list");
    this.pagination = this.root.locator("ul.pagination");
  }

  getArticle(title: string): ArticlePreviewComponent {
    const preview = this.root.locator(".article-preview", {
      has: this.page.getByRole("heading", { name: title, exact: true }),
    });
    return new ArticlePreviewComponent(preview);
  }

  getFirstArticle(): ArticlePreviewComponent {
    return new ArticlePreviewComponent(this.getAllPreviews().first());
  }

  getAllPreviews(): Locator {
    return this.root.locator(".article-preview");
  }

  getPageButton(pageNumber: number): Locator {
    return this.pagination.getByRole("button", {
      name: String(pageNumber),
      exact: true,
    });
  }

  async goToPage(pageNumber: number): Promise<void> {
    await this.getPageButton(pageNumber).click();
  }

  async getArticleCount(): Promise<number> {
    return this.getAllPreviews().count();
  }
}
