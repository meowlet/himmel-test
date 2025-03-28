import { WebDriver } from "selenium-webdriver";
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { createDriver } from "./setup";
import { SignUpPage } from "../pages/SignUpPage";
import { testConfig } from "../config/settings";

describe("SignUp Page Tests", () => {
  let driver: WebDriver;
  let signUpPage: SignUpPage;

  beforeEach(async () => {
    driver = await createDriver();
    signUpPage = new SignUpPage(driver, testConfig.baseUrl);
    await signUpPage.navigate();
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("should successfully register with valid information", async () => {
    // Generate unique email to avoid duplicate registration issues
    const uniqueEmail = `test_${Date.now()}@himmel.com`;

    await signUpPage.signUp(
      "newuser" + Date.now(),
      uniqueEmail,
      testConfig.users.standard.password,
      testConfig.users.standard.password
    );

    const successMessage = await signUpPage.getSuccessMessage();
    expect(successMessage).toContain("Sign up successfully, redirecting...");
  });

  test("should show error with invalid email format", async () => {
    await signUpPage.signUp(
      "newuser",
      "invalid-email@himmel",
      testConfig.users.standard.password,
      testConfig.users.standard.password
    );

    const errorMessage = await signUpPage.getErrorMessage("email");
    expect(errorMessage).toContain("Invalid email address");
  });

  test("should show error with weak password", async () => {
    await signUpPage.signUp(
      "newuser",
      "test@example.com",
      "weakweak",
      "weakweak"
    );

    const errorMessage = await signUpPage.getErrorMessage("password");
    expect(errorMessage).toContain(
      "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
    );
  });
});
