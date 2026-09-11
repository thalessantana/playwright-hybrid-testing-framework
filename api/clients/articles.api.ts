import type { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApi } from "./base.api";
import type {
  CreateArticleRequest,
  UpdateArticleRequest,
} from "@api/schemas/article.schema";

export interface ListArticlesQuery {
  tag?: string;
  author?: string;
  favorited?: string;
  limit?: number;
  offset?: number;
}

export class ArticlesApi extends BaseApi {
  private readonly endpoint = "/api/articles";

  constructor(request: APIRequestContext, token?: string) {
    super(request, token);
  }

  async createArticle(payload: CreateArticleRequest): Promise<APIResponse> {
    return this.post(this.endpoint, payload);
  }

  async getArticle(slug: string): Promise<APIResponse> {
    return this.get(`${this.endpoint}/${slug}`);
  }

  async listArticles(params?: ListArticlesQuery): Promise<APIResponse> {
    return this.get(this.endpoint, params as Record<string, string | number>);
  }

  async getFeed(
    params?: Pick<ListArticlesQuery, "limit" | "offset">,
  ): Promise<APIResponse> {
    return this.get(
      `${this.endpoint}/feed`,
      params as Record<string, string | number>,
    );
  }

  async updateArticle(
    slug: string,
    payload: UpdateArticleRequest,
  ): Promise<APIResponse> {
    return this.put(`${this.endpoint}/${slug}`, payload);
  }

  async deleteArticle(slug: string): Promise<APIResponse> {
    return this.delete(`${this.endpoint}/${slug}`);
  }

  async favoriteArticle(slug: string): Promise<APIResponse> {
    return this.post(`${this.endpoint}/${slug}/favorite`);
  }

  async unfavoriteArticle(slug: string): Promise<APIResponse> {
    return this.delete(`${this.endpoint}/${slug}/favorite`);
  }
}
