import { test, expect } from "@playwright/test";
import { generateCreateArticleData } from "@api/factories/article.factory";

test.describe("Conduit UI - Article Creation (Authenticated)", () => {
  test("should create a new article and verify it is displayed", async ({
    page,
  }) => {
    const articleData = generateCreateArticleData();

    await page.goto("/editor");

    await page.getByPlaceholder("Article Title").fill(articleData.title);
    await page
      .getByPlaceholder("What's this article about?")
      .fill(articleData.description);
    await page
      .getByPlaceholder("Write your article (in markdown)")
      .fill(articleData.body);

    await page.getByRole("button", { name: "Publish Article" }).click();

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      articleData.title,
    );
  });
});
