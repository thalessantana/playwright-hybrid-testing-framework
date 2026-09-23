import type { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApi } from "./base.api";
import type {
  CreateUserRequest,
  LoginUserRequest,
} from "@api/schemas/user.schema";

/**
 * API client for authentication endpoints (register and login).
 */
export class AuthApi extends BaseApi {
  /**
   * @param request - Playwright API request context.
   */
  constructor(request: APIRequestContext) {
    super(request);
  }

  /**
   * Registers a new user account.
   * @param payload - The user registration data wrapped in `{ user: ... }`.
   * @returns The API response containing the created user and token.
   */
  async register(payload: CreateUserRequest): Promise<APIResponse> {
    return this.post("/api/users", payload);
  }

  /**
   * Authenticates an existing user.
   * @param payload - The login credentials wrapped in `{ user: ... }`.
   * @returns The API response containing the authenticated user and token.
   */
  async login(payload: LoginUserRequest): Promise<APIResponse> {
    return this.post("/api/users/login", payload);
  }
}
