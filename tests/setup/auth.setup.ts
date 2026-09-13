import { test as setup, expect } from "@playwright/test";
import { AuthApi } from "@api/clients/auth.api";
import { generateCreateUserPayload } from "@api/factories/user.factory";
import { STORAGE_STATE } from "../../playwright.config";
import fs from "fs";
import path from "path";

const JWT_LOCAL_STORAGE_KEY = "jwtToken";

setup("authenticate", async ({ request }) => {
  const uiBaseUrl = process.env.UI_BASE_URL;
  expect(uiBaseUrl, "UI_BASE_URL env var must be set").toBeTruthy();

  const authApi = new AuthApi(request);
  const userPayload = generateCreateUserPayload();

  const response = await authApi.register(userPayload);
  expect(response.status()).toBe(201);

  const body = await response.json();
  const token = body.user?.token;
  expect(token, "JWT token should be present in register response").toBeTruthy();

  const storageState = {
    cookies: [],
    origins: [
      {
        origin: uiBaseUrl,
        localStorage: [{ name: JWT_LOCAL_STORAGE_KEY, value: token }],
      },
    ],
  };

  const dir = path.dirname(STORAGE_STATE);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORAGE_STATE, JSON.stringify(storageState, null, 2));
});
