import { WebDriver } from "selenium-webdriver";
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from "bun:test";
import { createDriver } from "../utils/Setup";
import { PasswordChangePage } from "../pages/PasswordChangePage";
import { testConfig } from "../config/settings";
import { ExcelDataReader } from "../utils/ExcelDataReader";
import { ReporterHelper } from "../utils/ReporterHelper";

const excelReader = new ExcelDataReader("./test-data/test-data.xlsx");
const TEST_SHEET = "PasswordChangeTests";
const SIGNIN_SHEET = "SignInTests";

const reporter = ReporterHelper.initReporter("PasswordChangeTests");

describe("Password Change Page Tests", () => {
  let driver: WebDriver;
  let passwordChangePage: PasswordChangePage;
  let validSignInCredentials: any;

  beforeEach(async () => {
    driver = await createDriver();
    passwordChangePage = new PasswordChangePage(driver, testConfig.baseUrl);

    validSignInCredentials = excelReader.getTestCaseData(
      SIGNIN_SHEET,
      "TC001",
      "D"
    );

    await passwordChangePage.signIn(
      validSignInCredentials.username,
      validSignInCredentials.password
    );
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

  test("should successfully change password with valid information", async () => {
    await ReporterHelper.executeTest(
      "TC001",
      "Valid Password Change",
      async () => {
        const testData = excelReader.getTestCaseData(TEST_SHEET, "TC001", "D");

        const originalPassword = testData.currentPassword;
        const newPassword = testData.newPassword;

        await passwordChangePage.changePassword(
          originalPassword,
          newPassword,
          testData.confirmNewPassword
        );

        await passwordChangePage.changePassword(
          newPassword,
          originalPassword,
          originalPassword
        );

        const successMessage = await passwordChangePage.getSuccessMessage();
        expect(successMessage).toContain("Change password successfully");
      }
    );
  });

  test("should show error with incorrect current password", async () => {
    await ReporterHelper.executeTest(
      "TC002",
      "Incorrect Current Password",
      async () => {
        const testData = excelReader.getTestCaseData(TEST_SHEET, "TC002", "D");

        await passwordChangePage.changePassword(
          testData.currentPassword,
          testData.newPassword,
          testData.confirmNewPassword
        );

        const errorMessage = await passwordChangePage.getErrorMessage();
        expect(errorMessage).toContain("Current password is incorrect");
      }
    );
  });

  test("should show error with weak new password", async () => {
    await ReporterHelper.executeTest("TC003", "Weak New Password", async () => {
      const testData = excelReader.getTestCaseData(TEST_SHEET, "TC003", "D");

      await passwordChangePage.changePassword(
        testData.currentPassword,
        testData.newPassword,
        testData.confirmNewPassword
      );

      const errorMessage = await passwordChangePage.getErrorMessage(
        "newPassword"
      );
      expect(errorMessage).toContain(
        "New password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
      );
    });
  });

  test("should show error when new password is same as current password", async () => {
    await ReporterHelper.executeTest(
      "TC005",
      "New Password Same as Current",
      async () => {
        expect(true).toBe(false);
      }
    );
  });

  test("should show error when passwords don't match", async () => {
    await ReporterHelper.executeTest(
      "TC004",
      "Passwords Don't Match",
      async () => {
        const testData = excelReader.getTestCaseData(TEST_SHEET, "TC004", "D");

        await passwordChangePage.changePassword(
          testData.currentPassword,
          testData.newPassword,
          testData.confirmNewPassword
        );

        const errorMessage = await passwordChangePage.getErrorMessage(
          "confirmNewPassword"
        );
        expect(errorMessage).toContain("Confirm password does not match");
      }
    );
  });
});
