import type { Locator, Page } from "@playwright/test";

export class AuthPage {
  private readonly page: Page;
  private readonly form: Locator;

  readonly heading: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  readonly switchToSignInLink: Locator;
  readonly switchToSignUpLink: Locator;

  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator("app-auth-page form");

    this.heading = page.locator("app-auth-page h1");
    this.usernameInput = this.form.getByPlaceholder("Username");
    this.emailInput = this.form.getByPlaceholder("Email");
    this.passwordInput = this.form.getByPlaceholder("Password");
    this.submitButton = this.form.getByRole("button", {
      name: /sign (in|up)/i,
    });

    this.switchToSignInLink = page
      .locator("app-auth-page")
      .getByRole("link", { name: "Have an account?" });
    this.switchToSignUpLink = page
      .locator("app-auth-page")
      .getByRole("link", { name: "Need an account?" });

    this.errorMessages = page.locator("app-list-errors ul.error-messages");
  }

  async gotoSignIn(): Promise<void> {
    await this.page.goto("/login");
  }

  async gotoSignUp(): Promise<void> {
    await this.page.goto("/register");
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async signUp(
    username: string,
    email: string,
    password: string,
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async clickSwitchToSignIn(): Promise<void> {
    await this.switchToSignInLink.click();
  }

  async clickSwitchToSignUp(): Promise<void> {
    await this.switchToSignUpLink.click();
  }

  async getErrorMessages(): Promise<string[]> {
    const items = await this.errorMessages.locator("li").allTextContents();
    return items.map((msg) => msg.trim());
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent())?.trim() ?? "";
  }
}
