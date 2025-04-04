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
import { SignUpPage } from "../pages/SignUpPage";
import { testConfig } from "../config/settings";
import { ExcelDataReader } from "../utils/ExcelDataReader";
import { ReporterHelper } from "../utils/ReporterHelper";

const excelReader = new ExcelDataReader("./test-data/test-data.xlsx");
const TEST_SHEET = "SignUpTests";

const reporter = ReporterHelper.initReporter("SignUpTests");

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

  afterAll(() => {
    ReporterHelper.exportReport();
  });

  test("should successfully register with valid information", async () => {
    await ReporterHelper.executeTest(
      "TC001",
      "Valid Registration",
      async () => {
        const testData = excelReader.getTestCaseData(TEST_SHEET, "TC001", "D");

        const uniqueEmail = testData.email.replace("@", `_${Date.now()}@`);

        await signUpPage.signUp(
          testData.username + Date.now(),
          uniqueEmail,
          testData.password,
          testData.password
        );

        const successMessage = await signUpPage.getSuccessMessage();
        expect(successMessage).toContain(
          "Sign up successfully, redirecting..."
        );
      }
    );
  });

  test("should show error with invalid email format", async () => {
    await ReporterHelper.executeTest(
      "TC002",
      "Invalid Email Format",
      async () => {
        const testData = excelReader.getTestCaseData(TEST_SHEET, "TC002", "D");

        await signUpPage.signUp(
          Date.now() + testData.username,
          Date.now() + testData.email,
          testData.password,
          testData.password
        );

        const errorMessage = await signUpPage.getErrorMessage("email");
        expect(errorMessage).toContain("Invalid email address");
      }
    );
  });

  test("should show error with weak password", async () => {
    await ReporterHelper.executeTest("TC003", "Weak Password", async () => {
      const testData = excelReader.getTestCaseData(TEST_SHEET, "TC003", "D");

      await signUpPage.signUp(
        testData.username,
        testData.email,
        testData.password,
        testData.password
      );

      const errorMessage = await signUpPage.getErrorMessage("password");
      expect(errorMessage).toContain(
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"
      );
    });
  });
});
