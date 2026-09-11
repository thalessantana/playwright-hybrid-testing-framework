import { test } from "@playwright/test";
import { expect } from "@fixtures/index";
import { AuthApi } from "@api/clients/auth.api";
import { UserApi } from "@api/clients/user.api";
import {
  generateCreateUserPayload,
  generateUpdateUserPayload,
} from "@api/factories/user.factory";
import {
  UserResponseSchema,
  ProfileResponseSchema,
  type UserResponse,
} from "@api/schemas/user.schema";

test.describe("REST API: User & Authentication Operations Suite", () => {
  let authApi: AuthApi;

  test.beforeEach(async ({ request }) => {
    authApi = new AuthApi(request);
  });

  test("register: should create new user and return valid token and schema", async () => {
    const userPayload = generateCreateUserPayload();
    const response = await authApi.register(userPayload);

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchSchema(UserResponseSchema);
    expect(body.user.email).toBe(userPayload.user.email);
    expect(body.user.username).toBe(userPayload.user.username);
    expect(body.user.token).toBeDefined();
    expect(typeof body.user.token).toBe("string");
  });

  test("register: should return 422 when attempting to register duplicate email", async () => {
    const userPayload = generateCreateUserPayload();

    const firstAttempt = await authApi.register(userPayload);
    expect(firstAttempt.status()).toBe(201);

    const duplicateAttempt = await authApi.register(userPayload);
    expect(duplicateAttempt.status()).toBe(422);

    const errorBody = await duplicateAttempt.json();
    expect(errorBody).toHaveProperty("errors");
    expect(errorBody.errors).toHaveProperty("email");
  });

  test("login: should authenticate existing user successfully", async () => {
    const userPayload = generateCreateUserPayload();
    await authApi.register(userPayload);

    const loginResponse = await authApi.login({
      user: {
        email: userPayload.user.email,
        password: userPayload.user.password,
      },
    });

    expect(loginResponse.status()).toBe(200);

    const body = await loginResponse.json();
    expect(body).toMatchSchema(UserResponseSchema);
    expect(body.user.email).toBe(userPayload.user.email);
    expect(body.user.token).toBeDefined();
  });

  test("login: should reject credentials with invalid password", async () => {
    const userPayload = generateCreateUserPayload();
    await authApi.register(userPayload);

    const loginResponse = await authApi.login({
      user: {
        email: userPayload.user.email,
        password: "wrong_invalid_password_123",
      },
    });

    expect(loginResponse.status()).toBe(403);

    const body = await loginResponse.json();
    expect(body).toHaveProperty("errors");
  });

  test("getCurrentUser: should fetch profile data for authenticated session", async ({
    request,
  }) => {
    const userPayload = generateCreateUserPayload();
    const regRes = await authApi.register(userPayload);
    const regBody: UserResponse = await regRes.json();

    const userApi = new UserApi(request, regBody.user.token);
    const response = await userApi.getCurrentUser();

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchSchema(UserResponseSchema);
    expect(body.user.email).toBe(userPayload.user.email);
    expect(body.user.username).toBe(userPayload.user.username);
  });

  test("getCurrentUser: should reject unauthenticated request with 401", async ({
    request,
  }) => {
    const anonymousUserApi = new UserApi(request);
    const response = await anonymousUserApi.getCurrentUser();

    expect(response.status()).toBe(401);
  });

  test("updateCurrentUser: should update bio and image for authenticated user", async ({
    request,
  }) => {
    const userPayload = generateCreateUserPayload();
    const regRes = await authApi.register(userPayload);
    const regBody: UserResponse = await regRes.json();

    const userApi = new UserApi(request, regBody.user.token);
    const updatePayload = generateUpdateUserPayload();

    const response = await userApi.updateCurrentUser(updatePayload);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toMatchSchema(UserResponseSchema);
    expect(body.user.bio).toBe(updatePayload.user.bio);
    expect(body.user.image).toBe(updatePayload.user.image);
  });

  test("profiles: should view public profile, follow, and unfollow user", async ({
    request,
  }) => {
    const authorPayload = generateCreateUserPayload();
    const followerPayload = generateCreateUserPayload();

    await authApi.register(authorPayload);
    const followerRes = await authApi.register(followerPayload);
    const followerBody: UserResponse = await followerRes.json();

    const followerApi = new UserApi(request, followerBody.user.token);
    const targetUsername = authorPayload.user.username;

    const initialProfileRes = await followerApi.getProfile(targetUsername);
    expect(initialProfileRes.status()).toBe(200);

    const initialBody = await initialProfileRes.json();
    expect(initialBody).toMatchSchema(ProfileResponseSchema);
    expect(initialBody.profile.username).toBe(targetUsername);
    expect(initialBody.profile.following).toBe(false);

    const followRes = await followerApi.followUser(targetUsername);
    expect(followRes.status()).toBe(200);

    const followBody = await followRes.json();
    expect(followBody).toMatchSchema(ProfileResponseSchema);
    expect(followBody.profile.following).toBe(true);

    const unfollowRes = await followerApi.unfollowUser(targetUsername);
    expect(unfollowRes.status()).toBe(200);

    const unfollowBody = await unfollowRes.json();
    expect(unfollowBody).toMatchSchema(ProfileResponseSchema);
    expect(unfollowBody.profile.following).toBe(false);
  });
});
