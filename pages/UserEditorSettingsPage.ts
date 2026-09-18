import type { Locator, Page } from "@playwright/test";
import type { UpdateUserPayload } from "@api/schemas/user.schema";

export class UserEditorSettingsPage {
  private readonly page: Page;
  private readonly pictureUrl: Locator;
  private readonly username: Locator;
  private readonly bio: Locator;
  private readonly email: Locator;
  private readonly newPassword: Locator;
  private readonly updateSettingsButton: Locator;
  private readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pictureUrl = page.getByRole("textbox", {name: "URL of profile picture"})
    this.username = page.getByRole("textbox", {name: "Username"})
    this.bio = page.getByRole("textbox", {name: "Short bio about you"})
    this.email = page.getByRole("textbox", {name: "Email"})
    this.newPassword = page.getByRole("textbox", {name: "New Password"})
    this.updateSettingsButton = page.getByRole("button", {name: "Update Settings"})
    this.logoutButton = page.getByRole("button", {name: "Or click here to logout."})
  }

  async goto(): Promise<void> {
    await this.page.goto(`/settings`);
  }

  private async fillIfDefined(locator: Locator, value?: string | null): Promise<void> {
    if (value !== undefined) {
      await locator.fill(value ?? "");
    }
  }

  async updateSettings(userData: UpdateUserPayload): Promise<void> {
    await this.fillIfDefined(this.pictureUrl, userData.image);
    await this.fillIfDefined(this.username, userData.username);
    await this.fillIfDefined(this.bio, userData.bio);
    await this.fillIfDefined(this.email, userData.email);
    await this.fillIfDefined(this.newPassword, userData.password);

    await this.updateSettingsButton.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

}