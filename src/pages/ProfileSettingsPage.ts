import type { Locator, Page } from "@playwright/test";
import type { UpdateUserPayload } from "@api/schemas/user.schema";

export class ProfileSettingsPage {
  private readonly page: Page;
  readonly pictureUrlInput: Locator;
  readonly usernameInput: Locator;
  readonly bioInput: Locator;
  readonly emailInput: Locator;
  readonly newPasswordInput: Locator;
  readonly updateSettingsButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pictureUrlInput = page.getByRole("textbox", {
      name: "URL of profile picture",
    });
    this.usernameInput = page.getByRole("textbox", { name: "Username" });
    this.bioInput = page.getByRole("textbox", { name: "Short bio about you" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.newPasswordInput = page.getByRole("textbox", { name: "New Password" });
    this.updateSettingsButton = page.getByRole("button", {
      name: "Update Settings",
    });
    this.logoutButton = page.getByRole("button", {
      name: "Or click here to logout.",
    });
  }

  async goto(): Promise<this> {
    await this.page.goto(`/settings`);
    return this;
  }

  private async fillIfDefined(
    locator: Locator,
    value?: string | null,
  ): Promise<void> {
    if (value !== undefined) {
      await locator.fill(value ?? "");
    }
  }

  async updateSettings(userData: UpdateUserPayload): Promise<this> {
    await this.fillIfDefined(this.pictureUrlInput, userData.image);
    await this.fillIfDefined(this.usernameInput, userData.username);
    await this.fillIfDefined(this.bioInput, userData.bio);
    await this.fillIfDefined(this.emailInput, userData.email);
    await this.fillIfDefined(this.newPasswordInput, userData.password);

    await this.updateSettingsButton.click();
    return this;
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }
}
