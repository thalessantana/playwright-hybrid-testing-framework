import type { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApi } from "./base.api";
import type { UpdateUserRequest } from "@api/schemas/user.schema";

/**
 * API client for user-related endpoints (current user CRUD and profile interactions).
 */
export class UserApi extends BaseApi {
  private readonly userEndpoint = "/api/user";
  private readonly profilesEndpoint = "/api/profiles";

  /**
   * @param request - Playwright API request context.
   * @param token - Optional bearer token for authenticated requests.
   */
  constructor(request: APIRequestContext, token?: string) {
    super(request, token);
  }

  /**
   * Retrieves the currently authenticated user's data.
   * @returns The API response containing the current user profile.
   */
  async getCurrentUser(): Promise<APIResponse> {
    return this.get(this.userEndpoint);
  }

  /**
   * Updates the currently authenticated user's data.
   * @param payload - The fields to update, wrapped in `{ user: ... }`.
   * @returns The API response containing the updated user profile.
   */
  async updateCurrentUser(payload: UpdateUserRequest): Promise<APIResponse> {
    return this.put(this.userEndpoint, payload);
  }

  /**
   * Fetches a public user profile by username.
   * @param username - The target user's username.
   * @returns The API response containing the profile data.
   */
  async getProfile(username: string): Promise<APIResponse> {
    return this.get(`${this.profilesEndpoint}/${username}`);
  }

  /**
   * Follows a user by username.
   * @param username - The target user's username.
   * @returns The API response containing the updated profile (following = true).
   */
  async followUser(username: string): Promise<APIResponse> {
    return this.post(`${this.profilesEndpoint}/${username}/follow`);
  }

  /**
   * Unfollows a user by username.
   * @param username - The target user's username.
   * @returns The API response containing the updated profile (following = false).
   */
  async unfollowUser(username: string): Promise<APIResponse> {
    return this.delete(`${this.profilesEndpoint}/${username}/follow`);
  }
}
