import { test, expect } from "@fixtures/index";
import { generateCreateUserData } from "@factories/user.factory";

test.describe("Auth Page - Sign Up & Sign In", () => {
  test("should display Sign Up form with all required fields", async ({
    authPage,
  }) => {
    await authPage.gotoSignUp();

    await expect(authPage.heading).toHaveText("Sign up");
    await expect(authPage.usernameInput).toBeVisible();
    await expect(authPage.emailInput).toBeVisible();
    await expect(authPage.passwordInput).toBeVisible();
    await expect(authPage.submitButton).toBeVisible();
    await expect(authPage.switchToSignInLink).toBeVisible();
  });

  test("should display Sign In form without username field", async ({
    authPage,
  }) => {
    await authPage.gotoSignIn();

    await expect(authPage.heading).toHaveText("Sign in");
    await expect(authPage.usernameInput).toBeHidden();
    await expect(authPage.emailInput).toBeVisible();
    await expect(authPage.passwordInput).toBeVisible();
    await expect(authPage.submitButton).toBeVisible();
    await expect(authPage.switchToSignUpLink).toBeVisible();
  });

  test("should navigate between Sign Up and Sign In forms", async ({
    authPage,
  }) => {
    await authPage.gotoSignUp();
    await expect(authPage.heading).toHaveText("Sign up");

    await authPage.clickSwitchToSignIn();
    await expect(authPage.heading).toHaveText("Sign in");

    await authPage.clickSwitchToSignUp();
    await expect(authPage.heading).toHaveText("Sign up");
  });

  test("should register a new user and redirect to home", async ({
    authPage,
    navbar,
    page,
  }) => {
    const userData = generateCreateUserData();

    await authPage.gotoSignUp();
    await authPage.signUp(userData.username, userData.email, userData.password);

    await page.waitForURL("**/");
    await expect(navbar.getUserProfileLink(userData.username)).toBeVisible();
  });

  test.describe("Sign In with Pre-Registered User (API Bypass)", () => {
    let userData: ReturnType<typeof generateCreateUserData>;

    test.beforeEach(async ({ authApi }) => {
      userData = generateCreateUserData();

      const response = await authApi.register({
        user: {
          username: userData.username,
          email: userData.email,
          password: userData.password,
        },
      });
      expect(response.status()).toBe(201);
    });

    test("should sign in with valid credentials", async ({
      authPage,
      navbar,
      page,
    }) => {
      await authPage.gotoSignIn();
      await authPage.signIn(userData.email, userData.password);

      await page.waitForURL("**/");
      await expect(navbar.getUserProfileLink(userData.username)).toBeVisible();
    });
  });
});
