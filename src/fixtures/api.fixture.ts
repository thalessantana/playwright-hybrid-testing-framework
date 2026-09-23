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

async function loadAuthenticatedUser(
  apiContext: APIRequestContext,
): Promise<AuthenticatedUser> {
  const dir = path.dirname(STORAGE_STATE);
  const userDataPath = path.join(dir, "user-data.json");

  if (fs.existsSync(userDataPath)) {
    try {
      const content = fs.readFileSync(userDataPath, "utf-8");
      const user = JSON.parse(content);
      if (user?.username && user?.token) {
        return user;
      }
    } catch {
      // If parsing fails, fall back to token recovery
    }
  }

  if (fs.existsSync(STORAGE_STATE)) {
    try {
      const content = fs.readFileSync(STORAGE_STATE, "utf-8");
      const state = JSON.parse(content);
      const origin = state.origins?.[0];
      const tokenItem = origin?.localStorage?.find(
        (item: { name: string; value: string }) => item.name === "jwtToken",
      );
      if (tokenItem?.value) {
        const userApi = new UserApi(apiContext, tokenItem.value);
        const response = await userApi.getCurrentUser();
        if (response.ok()) {
          const data = await response.json();
          const user: AuthenticatedUser = {
            username: data.user.username,
            email: data.user.email,
            token: data.user.token ?? tokenItem.value,
            bio: data.user.bio,
            image: data.user.image,
          };
          try {
            fs.writeFileSync(userDataPath, JSON.stringify(user, null, 2));
          } catch {
            // Ignore write errors
          }
          return user;
        }
        throw new Error(
          `Failed to fetch user data with recovered token: HTTP ${response.status()}`,
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Failed to fetch user data")
      ) {
        throw error;
      }
    }
  }

  throw new Error(
    "Failed to load authenticated user: neither user-data.json nor a valid storageState session was found. Ensure auth.setup has run.",
  );
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

  authenticatedUser: async ({ apiContext }, use) => {
    const user = await loadAuthenticatedUser(apiContext);
    await use(user);
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
