import type { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApi } from "./base.api";
import type {
  CreateArticleRequest,
  UpdateArticleRequest,
} from "@api/schemas/article.schema";

/** Query parameters accepted by the list-articles endpoint. */
export interface ListArticlesQuery {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

/**
 * API client for article-related endpoints (CRUD, feed, and favorites).
 */
export class ArticlesApi extends BaseApi {
  private readonly endpoint = "/api/articles";

  /**
   * @param request - Playwright API request context.
   * @param token - Optional bearer token for authenticated requests.
   */
  constructor(request: APIRequestContext, token?: string) {
    super(request, token);
  }

  /**
   * Creates a new article.
   * @param payload - The article data wrapped in `{ article: ... }`.
   * @returns The API response containing the created article.
   */
  async createArticle(payload: CreateArticleRequest): Promise<APIResponse> {
    return this.post(this.endpoint, payload);
  }

  /**
   * Fetches a single article by its slug.
   * @param slug - The URL-friendly article identifier.
   * @returns The API response containing the article.
   */
  async getArticle(slug: string): Promise<APIResponse> {
    return this.get(`${this.endpoint}/${slug}`);
  }

  /**
   * Lists articles with optional filtering.
   * @param params - Optional query filters (tag, author, favorited, limit, offset).
   * @returns The API response containing the articles array and count.
   */
  async listArticles(params?: ListArticlesQuery): Promise<APIResponse> {
    return this.get(this.endpoint, params as Record<string, string | number>);
  }

  /**
   * Retrieves the authenticated user's article feed.
   * @param params - Optional pagination parameters (limit, offset).
   * @returns The API response containing the feed articles and count.
   */
  async getFeed(
    params?: Pick<ListArticlesQuery, "limit" | "offset">,
  ): Promise<APIResponse> {
    return this.get(
      `${this.endpoint}/feed`,
      params as Record<string, string | number>,
    );
  }

  /**
   * Updates an existing article.
   * @param slug - The slug of the article to update.
   * @param payload - The updated fields wrapped in `{ article: ... }`.
   * @returns The API response containing the updated article.
   */
  async updateArticle(
    slug: string,
    payload: UpdateArticleRequest,
  ): Promise<APIResponse> {
    return this.put(`${this.endpoint}/${slug}`, payload);
  }

  /**
   * Deletes an article by slug.
   * @param slug - The slug of the article to delete.
   * @returns The API response (expected 204 No Content).
   */
  async deleteArticle(slug: string): Promise<APIResponse> {
    return this.delete(`${this.endpoint}/${slug}`);
  }

  /**
   * Adds the authenticated user's favorite to an article.
   * @param slug - The slug of the article to favorite.
   * @returns The API response containing the updated article.
   */
  async favoriteArticle(slug: string): Promise<APIResponse> {
    return this.post(`${this.endpoint}/${slug}/favorite`);
  }

  /**
   * Removes the authenticated user's favorite from an article.
   * @param slug - The slug of the article to unfavorite.
   * @returns The API response containing the updated article.
   */
  async unfavoriteArticle(slug: string): Promise<APIResponse> {
    return this.delete(`${this.endpoint}/${slug}/favorite`);
  }
}

