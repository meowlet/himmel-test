import { WebDriver } from "selenium-webdriver";
import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { createDriver } from "./setup";
import { SignInPage } from "../pages/SignInPage";
import { testConfig } from "../config/settings";

describe("SignIn Page Tests", () => {
  let driver: WebDriver;
  let signInPage: SignInPage;

  beforeEach(async () => {
    driver = await createDriver();
    signInPage = new SignInPage(driver, testConfig.baseUrl);
    await signInPage.navigate();
  });

  afterEach(async () => {
    await driver.quit();
  });

  test("should successfully sign in with valid credentials", async () => {
    const { username, password } = testConfig.users.standard;
    await signInPage.signIn(username, password);

    const isSignedIn = await signInPage.isSignedIn();
    expect(isSignedIn).toBe(true);
  });

  test("should show error message with invalid username", async () => {
    await signInPage.signIn("invalid_user", testConfig.users.standard.password);

    const errorMessage = await signInPage.getErrorMessage();
    expect(errorMessage).toContain("User not found");
  });

  test("should show error message with invalid password", async () => {
    await signInPage.signIn(
      testConfig.users.standard.username,
      "wrong_password"
    );

    const errorMessage = await signInPage.getErrorMessage();
    expect(errorMessage).toContain("Password does not match");
  });
});
