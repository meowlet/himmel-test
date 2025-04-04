import { WebDriver } from "selenium-webdriver";
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from "bun:test";
import { SignUpPage } from "../../pages/SignUpPage";
import { SignInPage } from "../../pages/SignInPage";
import { PasswordChangePage } from "../../pages/PasswordChangePage";
import { testConfig } from "../../config/settings";
import { ExcelDataReader } from "../../utils/ExcelDataReader";
import { ReporterHelper } from "../../utils/ReporterHelper";
import { createDriver } from "../../utils/Setup";

const excelReader = new ExcelDataReader("./test-data/test-data.xlsx");
const SIGNUP_SHEET = "SignUpTests";
const SIGNIN_SHEET = "SignInTests";
const PASSWORD_SHEET = "PasswordChangeTests";

const reporter = ReporterHelper.initReporter("UserJourneyTests");

describe("User Journey Integration Tests", () => {
  let driver: WebDriver;
  let signUpPage: SignUpPage;
  let signInPage: SignInPage;
  let passwordChangePage: PasswordChangePage;

  beforeEach(async () => {
    driver = await createDriver();
    signUpPage = new SignUpPage(driver, testConfig.baseUrl);
    signInPage = new SignInPage(driver, testConfig.baseUrl);
    passwordChangePage = new PasswordChangePage(driver, testConfig.baseUrl);
  });

  afterEach(async () => {
    try {
      if (driver) {
        await driver.quit();
      }
    } catch (error) {
      console.error("Error while quitting driver:", error);
    }
  });

  afterAll(() => {
    ReporterHelper.exportReport();
  });

  test("Complete user journey: sign up, sign in, and change password", async () => {
    await ReporterHelper.executeTest("TC001", "Full User Journey", async () => {
      const signUpData = excelReader.getTestCaseData(
        SIGNUP_SHEET,
        "TC001",
        "D"
      );
      const passwordChangeData = excelReader.getTestCaseData(
        PASSWORD_SHEET,
        "TC001",
        "D"
      );

      const timestamp = Date.now();
      const username = `${signUpData.username}_${timestamp}`;
      const email = signUpData.email.replace("@", `_${timestamp}@`);
      const initialPassword = signUpData.password;

      await signUpPage.navigate();
      await signUpPage.signUp(
        username,
        email,
        initialPassword,
        initialPassword
      );

      const signUpSuccessMessage = await signUpPage.getSuccessMessage();
      expect(signUpSuccessMessage).toContain("Sign up successfully");

      await signInPage.navigate();
      await signInPage.signIn(username, initialPassword);

      const isSignedIn = await signInPage.isSignedIn();
      expect(isSignedIn).toBe(true);

      passwordChangePage.navigate();

      const newPassword = passwordChangeData.newPassword;
      await passwordChangePage.changePassword(
        initialPassword,
        newPassword,
        newPassword
      );

      await passwordChangePage.getSuccessMessage();
      await signInPage.navigate();
      await signInPage.signIn(username, newPassword);

      const isSignedInAgain = await signInPage.isSignedIn();
      expect(isSignedInAgain).toBe(true);
    });
  });

  test("Failed sign-in followed by password reset flow", async () => {
    await ReporterHelper.executeTest(
      "TC002",
      "Failed Login and Password Reset",
      async () => {
        const signInData = excelReader.getTestCaseData(
          SIGNIN_SHEET,
          "TC001",
          "D"
        );

        const signUpData = excelReader.getTestCaseData(
          SIGNUP_SHEET,
          "TC001",
          "D"
        );

        const timestamp = Date.now();
        const username = `${signUpData.username}_${timestamp}`;
        const email = signUpData.email.replace("@", `_${timestamp}@`);
        const initialPassword = signUpData.password;

        await signUpPage.navigate();
        await signUpPage.signUp(
          username,
          email,
          initialPassword,
          initialPassword
        );

        const signUpSuccessMessage = await signUpPage.getSuccessMessage();
        expect(signUpSuccessMessage).toContain("Sign up successfully");

        await signInPage.navigate();
        const incorrectPassword = "WrongPassword123!";
        await signInPage.signIn(email, incorrectPassword);

        const errorMessage = await signInPage.getErrorMessage();
        expect(errorMessage).toContain("Password does not match");

        const response = await fetch(
          `http://localhost:3000/api/auth/forgot-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
          }
        );

        console.log("Response status:", response);

        const resetData = await response.json();
        expect(resetData.status).toBe("success");

        const resetUrl = resetData.data.url;

        await driver.get(resetUrl);

        const newPassword = "0911Kiet@";

        const passwordInput = await driver.findElement({
          css: "input[type='password']",
        });
        await passwordInput.sendKeys(newPassword);

        const resetButton = await driver.findElement({
          css: "button[type='submit']",
        });
        await resetButton.click();

        await driver.wait(async () => {
          const currentUrl = await driver.getCurrentUrl();
          return (
            currentUrl.includes("/sign-in") || currentUrl.includes("/login")
          );
        }, 5000);

        await signInPage.navigate();
        await signInPage.signIn(signInData.username, newPassword);

        const isSignedIn = await signInPage.isSignedIn();
        expect(isSignedIn).toBe(true);
      }
    );
  });
});
