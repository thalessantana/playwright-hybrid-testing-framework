import type { Locator, Page } from "@playwright/test";

export class ArticlePage {
  private readonly page: Page;
  private readonly banner: Locator;
  private readonly commentForm: Locator;

  readonly articleTitle: Locator;
  readonly authorName: Locator;
  readonly authorImage: Locator;
  readonly articleDate: Locator;
  readonly followButton: Locator;
  readonly favoriteButton: Locator;
  readonly favoritesCount: Locator;

  readonly articleBody: Locator;
  readonly tagList: Locator;

  readonly commentInput: Locator;
  readonly postCommentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.banner = page.locator(".banner");
    this.commentForm = page.locator("form.comment-form");

    this.articleTitle = this.banner.getByRole("heading", { level: 1 });
    this.authorName = this.banner.locator(".info").getByRole("link");
    this.authorImage = this.banner.locator(".article-meta img");
    this.articleDate = this.banner.locator(".info .date");
    this.followButton = this.banner.locator("app-follow-button button");
    this.favoriteButton = this.banner.locator("app-favorite-button button");
    this.favoritesCount = this.favoriteButton.locator(".counter");
    this.articleBody = page.locator(".article-content");
    this.tagList = this.articleBody.locator(".tag-list");
    this.commentInput = this.commentForm.getByRole("textbox", {
      name: /write a comment/i,
    });
    this.postCommentButton = this.commentForm.getByRole("button", {
      name: "Post Comment",
    });
  }

  async goto(slug: string): Promise<void> {
    await this.page.goto(`/article/${slug}`);
  }

  async clickFollow(): Promise<void> {
    await this.followButton.click();
  }

  async clickFavorite(): Promise<void> {
    await this.favoriteButton.click();
  }

  async postComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
    await this.postCommentButton.click();
  }

  async getArticleTitleText(): Promise<string> {
    return (await this.articleTitle.textContent()) ?? "";
  }

  async getAuthorNameText(): Promise<string> {
    return (await this.authorName.textContent())?.trim() ?? "";
  }

  async getTags(): Promise<string[]> {
    const tags = await this.tagList.locator("li").allTextContents();
    return tags.map((tag) => tag.trim());
  }

  getCommentCard(commentText: string): Locator {
    return this.page.locator(".card", { hasText: commentText });
  }

  async deleteComment(commentText: string): Promise<void> {
    await this.getCommentCard(commentText).locator("i.ion-trash-a").click();
  }
}
