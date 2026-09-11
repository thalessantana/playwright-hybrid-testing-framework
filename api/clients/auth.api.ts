import type { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApi } from "./base.api";
import type {
  CreateUserRequest,
  LoginUserRequest,
} from "@api/schemas/user.schema";

export class AuthApi extends BaseApi {
  constructor(request: APIRequestContext) {
    super(request);
  }

  async register(payload: CreateUserRequest): Promise<APIResponse> {
    return this.post("/api/users", payload);
  }

  async login(payload: LoginUserRequest): Promise<APIResponse> {
    return this.post("/api/users/login", payload);
  }
}
