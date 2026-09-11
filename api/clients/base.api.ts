import type { APIRequestContext, APIResponse } from "@playwright/test";

/**
 * Abstract base class for all API clients.
 * Provides shared HTTP methods with automatic header injection (including auth tokens).
 */
export abstract class BaseApi {
  /**
   * @param request - Playwright API request context used to send HTTP calls.
   * @param token - Optional bearer token appended to the `Authorization` header.
   */
  constructor(
    protected readonly request: APIRequestContext,
    protected token?: string,
  ) {}

  /**
   * Replaces the current authentication token.
   * @param token - The new bearer token to use for subsequent requests.
   */
  public setToken(token: string): void {
    this.token = token;
  }

  /**
   * Builds the default request headers, injecting the `Authorization` header when a token is set.
   * @returns A headers record ready for use in HTTP calls.
   */
  protected get headers(): Record<string, string> {
    const defaultHeaders: Record<string, string> = {
      Accept: "application/json",
    };
    if (this.token) {
      defaultHeaders["Authorization"] = `Token ${this.token}`;
    }
    return defaultHeaders;
  }

  /**
   * Sends an HTTP GET request.
   * @param endpoint - The API path to call.
   * @param params - Optional query-string parameters.
   * @returns The raw Playwright {@link APIResponse}.
   */
  protected async get(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<APIResponse> {
    return this.request.get(endpoint, {
      headers: this.headers,
      params,
    });
  }

  /**
   * Sends an HTTP POST request.
   * @param endpoint - The API path to call.
   * @param data - Optional request body payload.
   * @returns The raw Playwright {@link APIResponse}.
   */
  protected async post<T>(endpoint: string, data?: T): Promise<APIResponse> {
    return this.request.post(endpoint, {
      headers: this.headers,
      data,
    });
  }

  /**
   * Sends an HTTP PUT request.
   * @param endpoint - The API path to call.
   * @param data - The request body payload.
   * @returns The raw Playwright {@link APIResponse}.
   */
  protected async put<T>(endpoint: string, data: T): Promise<APIResponse> {
    return this.request.put(endpoint, {
      headers: this.headers,
      data,
    });
  }

  /**
   * Sends an HTTP DELETE request.
   * @param endpoint - The API path to call.
   * @returns The raw Playwright {@link APIResponse}.
   */
  protected async delete(endpoint: string): Promise<APIResponse> {
    return this.request.delete(endpoint, {
      headers: this.headers,
    });
  }
}

