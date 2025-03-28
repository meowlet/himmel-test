import { WebDriver, By, until, WebElement } from "selenium-webdriver";

export class SignUpPage {
  private driver: WebDriver;
  private baseUrl: string;

  constructor(driver: WebDriver, baseUrl: string = "http://localhost:3001") {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async navigate(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/sign-up`);
  }

  async enterUsername(username: string): Promise<void> {
    const usernameInput = await this.driver.findElement(By.id("username"));
    await usernameInput.clear();
    await usernameInput.sendKeys(username);
  }

  async enterEmail(email: string): Promise<void> {
    const emailInput = await this.driver.findElement(By.id("email"));
    await emailInput.clear();
    await emailInput.sendKeys(email);
  }

  async enterPassword(password: string): Promise<void> {
    const passwordInput = await this.driver.findElement(By.id("password"));
    await passwordInput.clear();
    await passwordInput.sendKeys(password);
  }

  async checkTermsAndConditions(): Promise<void> {
    const checkbox = await this.driver.findElement(
      By.className("terms-checkbox")
    );
    await checkbox.click();
  }

  async clickSignUpButton(): Promise<void> {
    const signUpButton = await this.driver.findElement(
      By.css('button[type="submit"]')
    );
    await signUpButton.click();
  }

  async signUp(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<void> {
    await this.enterUsername(username);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.checkTermsAndConditions();
    await this.clickSignUpButton();
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
      5000
    );
    return await errorElement.getText();
  }

  async getSuccessMessage(): Promise<string> {
    const successElement = await this.driver.wait(
      until.elementLocated(By.className("success-message")),
      5000
    );
    return await successElement.getText();
  }

  async getTermsCheckbox() {
    return await this.driver.findElement(By.className("terms-checkbox"));
  }

  async isElementInvalid(element: WebElement): Promise<boolean> {
    return await this.driver.executeScript(
      "return arguments[0].validity && !arguments[0].validity.valid;",
      element
    );
  }
}
