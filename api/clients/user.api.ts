import type { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApi } from "./base.api";
import type { UpdateUserRequest } from "@api/schemas/user.schema";

export class UserApi extends BaseApi {
  private readonly userEndpoint = "/api/user";
  private readonly profilesEndpoint = "/api/profiles";

  constructor(request: APIRequestContext, token?: string) {
    super(request, token);
  }

  async getCurrentUser(): Promise<APIResponse> {
    return this.get(this.userEndpoint);
  }

  async updateCurrentUser(payload: UpdateUserRequest): Promise<APIResponse> {
    return this.put(this.userEndpoint, payload);
  }

  async getProfile(username: string): Promise<APIResponse> {
    return this.get(`${this.profilesEndpoint}/${username}`);
  }

  async followUser(username: string): Promise<APIResponse> {
    return this.post(`${this.profilesEndpoint}/${username}/follow`);
  }

  async unfollowUser(username: string): Promise<APIResponse> {
    return this.delete(`${this.profilesEndpoint}/${username}/follow`);
  }
}
