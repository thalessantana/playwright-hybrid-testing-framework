import { test, expect } from "@fixtures/index";
import { faker } from "@faker-js/faker";
import { generateCreateUserPayload } from "@factories/user.factory";

test.describe("Profile Settings Page", () => {
  test.beforeEach(async ({ page, authApi }) => {
    const userPayload = generateCreateUserPayload();
    const res = await authApi.register(userPayload);
    const data = await res.json();

    await page.addInitScript((token) => {
      window.localStorage.setItem("jwtToken", token);
    }, data.user.token);
  });

  test("should display settings form with all input fields", async ({
    profileSettingsPage,
  }) => {
    await profileSettingsPage.goto();

    await expect(profileSettingsPage.pictureUrlInput).toBeVisible();
    await expect(profileSettingsPage.usernameInput).toBeVisible();
    await expect(profileSettingsPage.bioInput).toBeVisible();
    await expect(profileSettingsPage.emailInput).toBeVisible();
    await expect(profileSettingsPage.newPasswordInput).toBeVisible();
    await expect(profileSettingsPage.updateSettingsButton).toBeVisible();
    await expect(profileSettingsPage.logoutButton).toBeVisible();
  });

  test("should update user bio successfully", async ({
    profileSettingsPage,
    profilePage,
  }) => {
    const newBio = "Updated by Playwright - " + faker.lorem.sentence();

    await profileSettingsPage.goto();
    await profileSettingsPage.updateSettings({ bio: newBio });

    await expect(profilePage.bio).toContainText(newBio);
  });

  test("should logout user and redirect to home", async ({
    profileSettingsPage,
    navbar,
    page,
  }) => {
    await profileSettingsPage.goto();

    await profileSettingsPage.logout();

    await page.waitForURL("**/");
    await expect(navbar.signInLink).toBeVisible();
    await expect(navbar.signUpLink).toBeVisible();
  });
});
