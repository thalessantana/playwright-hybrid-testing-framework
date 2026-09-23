import { test as base, type APIRequestContext } from "@playwright/test";
import { ArticlesApi } from "@api/clients/articles.api";
import { AuthApi } from "@api/clients/auth.api";
import { UserApi } from "@api/clients/user.api";
import { STORAGE_STATE } from "../../playwright.config";
import fs from "fs";
import path from "path";

export interface AuthenticatedUser {
  username: string;
  email: string;
  token: string;
  bio?: string;
  image?: string;
}

export type ApiFixtures = {
  apiContext: APIRequestContext;
  authApi: AuthApi;
  articlesApi: ArticlesApi;
  userApi: UserApi;
  authenticatedUser: AuthenticatedUser;
};

function loadAuthenticatedUser(): AuthenticatedUser {
  try {
    const dir = path.dirname(STORAGE_STATE);
    const userDataPath = path.join(dir, "user-data.json");
    if (fs.existsSync(userDataPath)) {
      const content = fs.readFileSync(userDataPath, "utf-8");
      return JSON.parse(content);
    }

    if (fs.existsSync(STORAGE_STATE)) {
      const content = fs.readFileSync(STORAGE_STATE, "utf-8");
      const state = JSON.parse(content);
      const origin = state.origins?.[0];
      const tokenItem = origin?.localStorage?.find(
        (item: { name: string; value: string }) => item.name === "jwtToken",
      );
      if (tokenItem) {
        return {
          username: "",
          email: "",
          token: tokenItem.value,
        };
      }
    }
  } catch {
    // Fallback if file does not exist yet or cannot be read
  }

  return { username: "", email: "", token: "" };
}

export const apiFixture = base.extend<ApiFixtures>({
  apiContext: async ({ playwright }, use) => {
    const apiBaseUrl = process.env.API_BASE_URL;
    const context = await playwright.request.newContext({
      baseURL: apiBaseUrl,
      extraHTTPHeaders: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    await use(context);
    await context.dispose();
  },

  authenticatedUser: async ({}, use) => {
    await use(loadAuthenticatedUser());
  },

  authApi: async ({ apiContext }, use) => {
    await use(new AuthApi(apiContext));
  },

  articlesApi: async ({ apiContext, authenticatedUser }, use) => {
    await use(new ArticlesApi(apiContext, authenticatedUser.token));
  },

  userApi: async ({ apiContext, authenticatedUser }, use) => {
    await use(new UserApi(apiContext, authenticatedUser.token));
  },
});
