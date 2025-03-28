import { WebDriver, By, until } from "selenium-webdriver";

export class SignInPage {
  private driver: WebDriver;
  private baseUrl: string;

  constructor(driver: WebDriver, baseUrl: string = "http://localhost:3001") {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async navigate(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/sign-in`);
  }

  async enterUsername(username: string): Promise<void> {
    const usernameInput = await this.driver.findElement(
      By.className("identifier")
    );
    await usernameInput.clear();
    await usernameInput.sendKeys(username);
  }

  async enterPassword(password: string): Promise<void> {
    const passwordInput = await this.driver.findElement(
      By.className("password")
    );
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
  }

  async clickSignInButton(): Promise<void> {
    const signInButton = await this.driver.findElement(
      By.css('button[type="submit"]')
    );
    await signInButton.click();
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignInButton();
  }

  async getErrorMessage(): Promise<string> {
    const errorElement = await this.driver.wait(
      until.elementLocated(By.className("error-message")),
      5000
    );

    return await errorElement.getText();
  }

  async getInputErrorMessage(): Promise<string> {
    const errorElement = await this.driver.wait(
      until.elementLocated(By.className("input-error")),
      5000
    );

    return await errorElement.getText();
  }

  async isSignedIn(): Promise<boolean> {
    try {
      await this.driver.wait(
        until.elementLocated(By.className("success-message")),
        5000
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
