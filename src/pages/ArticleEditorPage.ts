import { expect, type Locator, type Page } from "@playwright/test";
import type {
  CreateArticlePayload,
  UpdateArticlePayload,
} from "@api/schemas/article.schema";

export interface UpdateArticleUIOptions extends UpdateArticlePayload {
  addTags?: string[];
  removeTags?: string[];
}

export class ArticleEditorPage {
  private readonly page: Page;
  private readonly articleTitle: Locator;
  private readonly articleDescription: Locator;
  private readonly articleBody: Locator;
  private readonly articleTagsInput: Locator;
  private readonly publishArticleButton: Locator;

  private getTagRemoveIcon(tag: string): Locator {
    return this.page
      .locator(".tag-list span.tag-pill", {
        has: this.page.getByText(tag, { exact: true }),
      })
      .locator("i.ion-close-round");
  }

  constructor(page: Page) {
    this.page = page;
    this.articleTitle = page.getByRole("textbox", { name: "Article Title" });
    this.articleDescription = page.getByRole("textbox", {
      name: "What's this article about?",
    });
    this.articleBody = page.getByRole("textbox", {
      name: "Write your article (in markdown)",
    });
    this.articleTagsInput = page.getByRole("textbox", { name: "Enter tags" });
    this.publishArticleButton = page.getByRole("button", {
      name: "Publish Article",
    });
  }

  async goto(): Promise<this> {
    await this.page.goto("/editor");
    return this;
  }

  async gotoEditArticlePage(slug: string): Promise<this> {
    await this.page.goto(`/editor/${slug}`);
    await expect(this.articleTitle).not.toHaveValue("");
    return this;
  }

  private async fillIfDefined(locator: Locator, value?: string): Promise<void> {
    if (value !== undefined) {
      await locator.fill(value);
    }
  }

  async addTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.articleTagsInput.fill(tag);
      await this.articleTagsInput.press("Enter");
    }
  }

  async removeTag(tag: string): Promise<void> {
    await this.getTagRemoveIcon(tag).click();
  }

  async removeTags(tags: string[]): Promise<void> {
    for (const tag of tags) {
      await this.removeTag(tag);
    }
  }

  async createArticle(articleData: CreateArticlePayload): Promise<void> {
    await this.articleTitle.fill(articleData.title);
    await this.articleDescription.fill(articleData.description);
    await this.articleBody.fill(articleData.body);

    if (articleData.tagList?.length) {
      await this.addTags(articleData.tagList);
    }

    await this.publishArticleButton.click();
  }

  async updateArticle(articleData: UpdateArticleUIOptions): Promise<void> {
    await this.fillIfDefined(this.articleTitle, articleData.title);
    await this.fillIfDefined(this.articleDescription, articleData.description);
    await this.fillIfDefined(this.articleBody, articleData.body);

    if (articleData.removeTags?.length) {
      await this.removeTags(articleData.removeTags);
    }

    if (articleData.addTags?.length) {
      await this.addTags(articleData.addTags);
    }

    await this.publishArticleButton.click();
  }
}
