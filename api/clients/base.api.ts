import type { APIRequestContext, APIResponse } from "@playwright/test";

export abstract class BaseApi {
  constructor(
    protected readonly request: APIRequestContext,
    protected token?: string,
  ) {}

  public setToken(token: string): void {
    this.token = token;
  }

  protected get headers(): Record<string, string> {
    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
    };
    if (this.token) {
      defaultHeaders["Authorization"] = `Token ${this.token}`;
    }
    return defaultHeaders;
  }

  protected async get(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<APIResponse> {
    return this.request.get(endpoint, {
      headers: this.headers,
      params,
    });
  }

  protected async post<T>(endpoint: string, data?: T): Promise<APIResponse> {
    return this.request.post(endpoint, {
      headers: this.headers,
      data,
    });
  }

  protected async put<T>(endpoint: string, data: T): Promise<APIResponse> {
    return this.request.put(endpoint, {
      headers: this.headers,
      data,
    });
  }

  protected async delete(endpoint: string): Promise<APIResponse> {
    return this.request.delete(endpoint, {
      headers: this.headers,
    });
  }
}
