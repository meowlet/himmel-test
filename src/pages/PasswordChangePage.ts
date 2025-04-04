import { WebDriver, By, until, WebElement } from "selenium-webdriver";

export class PasswordChangePage {
  private driver: WebDriver;
  private baseUrl: string;

  constructor(driver: WebDriver, baseUrl: string = "http://localhost:3001") {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async navigate(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/change-password`);
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.driver.get(`${this.baseUrl}/sign-in`);

    const usernameInput = await this.driver.findElement(
      By.className("identifier")
    );
    await usernameInput.clear();
    await usernameInput.sendKeys(username);

    const passwordInput = await this.driver.findElement(
      By.className("password")
    );
    await passwordInput.clear();
    await passwordInput.sendKeys(password);

    const signInButton = await this.driver.findElement(
      By.css('button[type="submit"]')
    );
    await signInButton.click();

    await this.driver.wait(
      until.urlContains("/dashboard"),
      50000,
      "Sign-in failed or timed out"
    );

    await this.navigate();
  }

  async enterCurrentPassword(password: string): Promise<void> {
    const currentPasswordInput = await this.driver.findElement(
      By.id("currentPassword")
    );
    await currentPasswordInput.clear();
    await currentPasswordInput.sendKeys(password);
  }

  async enterNewPassword(password: string): Promise<void> {
    const newPasswordInput = await this.driver.findElement(
      By.id("newPassword")
    );
    await newPasswordInput.clear();
    await newPasswordInput.sendKeys(password);
  }

  async enterConfirmNewPassword(password: string): Promise<void> {
    const confirmNewPasswordInput = await this.driver.findElement(
      By.id("confirmNewPassword")
    );
    await confirmNewPasswordInput.clear();
    await confirmNewPasswordInput.sendKeys(password);
  }

  async clickChangePasswordButton(): Promise<void> {
    const changePasswordButton = await this.driver.findElement(
      By.css('button[type="submit"]')
    );
    await changePasswordButton.click();
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<void> {
    await this.enterCurrentPassword(currentPassword);
    await this.enterNewPassword(newPassword);
    await this.enterConfirmNewPassword(confirmNewPassword);
    await this.clickChangePasswordButton();
  }

  async getErrorMessage(fieldName?: string): Promise<string> {
    let selector: By;

    if (fieldName) {
      selector = By.className(`${fieldName}-error`);
    } else {
      selector = By.className("error-message");
    }

    const errorElement = await this.driver.wait(
      until.elementLocated(selector),
      50000
    );

    return (await errorElement.getText()) || "";
  }

  async getSuccessMessage(): Promise<string> {
    const successElement = await this.driver.wait(
      until.elementLocated(By.className("success-message")),
      50000
    );
    return await successElement.getText();
  }
}
