import { WebDriver } from "selenium-webdriver";
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from "bun:test";
import { SignInPage } from "../pages/SignInPage";
import { testConfig } from "../config/settings";
import { ExcelDataReader } from "../utils/ExcelDataReader";
import { ReporterHelper } from "../utils/ReporterHelper";
import { createDriver } from "../utils/Setup";

const excelReader = new ExcelDataReader("./test-data/test-data.xlsx");
const TEST_SHEET = "SignInTests";

const reporter = ReporterHelper.initReporter("SignInTests");

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

  afterAll(() => {
    ReporterHelper.exportReport();
  });

  test("should successfully sign in with valid credentials", async () => {
    await ReporterHelper.executeTest("TC001", "Valid Sign In", async () => {
      const testData = excelReader.getTestCaseData(TEST_SHEET, "TC001", "D");

      await signInPage.signIn(testData.username, testData.password);

      const isSignedIn = await signInPage.isSignedIn();
      expect(isSignedIn).toBe(true);
    });
  });

  test("should show error message with invalid password", async () => {
    await ReporterHelper.executeTest("TC002", "Invalid Password", async () => {
      const testData = excelReader.getTestCaseData(TEST_SHEET, "TC002", "D");

      await signInPage.signIn(testData.username, testData.password);

      const errorMessage = await signInPage.getErrorMessage();
      expect(errorMessage).toContain("Password does not match");
    });
  });

  test("should show error message with non-existent user", async () => {
    await ReporterHelper.executeTest("TC003", "Non-existent User", async () => {
      const testData = excelReader.getTestCaseData(TEST_SHEET, "TC003", "D");

      await signInPage.signIn(testData.username, testData.password);

      const errorMessage = await signInPage.getErrorMessage();
      expect(errorMessage).toContain("User not found");
    });
  });
});
