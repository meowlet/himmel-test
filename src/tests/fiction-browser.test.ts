import { WebDriver, By } from "selenium-webdriver";
import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  afterAll,
} from "bun:test";
import { createDriver } from "../utils/Setup";
import { testConfig } from "../config/settings";
import { ExcelDataReader } from "../utils/ExcelDataReader";
import { ReporterHelper } from "../utils/ReporterHelper";
import { FictionBrowserPage } from "../pages/FictionBrowserPage";

const excelReader = new ExcelDataReader("./test-data/test-data.xlsx");
const TEST_SHEET = "FictionBrowserTests";

const reporter = ReporterHelper.initReporter("FictionBrowserTests");

describe("Fiction Browser Page Tests", () => {
  let driver: WebDriver;
  let fictionBrowserPage: FictionBrowserPage;

  beforeEach(async () => {
    driver = await createDriver();
    fictionBrowserPage = new FictionBrowserPage(driver, testConfig.baseUrl);
    await fictionBrowserPage.navigate();
  });

  afterEach(async () => {
    await driver.quit();
  });

  afterAll(() => {
    ReporterHelper.exportReport();
  });

  test("should search for fictions by title", async () => {
    await ReporterHelper.executeTest(
      "TCFB001",
      "Search Fiction By Title",
      async () => {
        const testData = excelReader.getTestCaseData(
          TEST_SHEET,
          "TCFB001",
          "D"
        );

        await fictionBrowserPage.searchFiction(testData.searchTerm);

        const fictionTitles = await fictionBrowserPage.getFictionTitles();
        expect(
          fictionTitles.some((title) =>
            title.toLowerCase().includes(testData.searchTerm.toLowerCase())
          )
        ).toBe(true);
      }
    );
  });

  test("should filter fictions by tags", async () => {
    await ReporterHelper.executeTest(
      "TCFB003",
      "Filter Fiction By Tags",
      async () => {
        const testData = excelReader.getTestCaseData(
          TEST_SHEET,
          "TCFB003",
          "D"
        );

        await fictionBrowserPage.openFilterModal();

        await fictionBrowserPage.selectTags(testData.tags);

        await fictionBrowserPage.applyFilters();

        const hasTags = await fictionBrowserPage.verifyFictionsHaveTags(
          testData.tags
        );
        expect(hasTags).toBe(true);
      }
    );
  });

  test("should sort fictions by different criteria", async () => {
    await ReporterHelper.executeTest("TCFB004", "Sort Fictions", async () => {
      const testData = excelReader.getTestCaseData(TEST_SHEET, "TCFB004", "D");

      await fictionBrowserPage.selectSortType(testData.sortType);

      await fictionBrowserPage.selectSortOrder(testData.sortOrder);

      const isSorted = await fictionBrowserPage.verifyFictionsSorted(
        testData.sortType,
        testData.sortOrder
      );
      expect(isSorted).toBe();
    });
  });

  test("should navigate through pagination", async () => {
    await ReporterHelper.executeTest(
      "TCFB005",
      "Pagination Navigation",
      async () => {
        const initialTitles = await fictionBrowserPage.getFictionTitles();

        await fictionBrowserPage.goToNextPage();

        const secondPageTitles = await fictionBrowserPage.getFictionTitles();

        expect(initialTitles).not.toEqual(secondPageTitles);
      }
    );
  });

  test("should change number of items per page", async () => {
    await ReporterHelper.executeTest(
      "TCFB006",
      "Change Items Per Page",
      async () => {
        const testData = excelReader.getTestCaseData(
          TEST_SHEET,
          "TCFB006",
          "D"
        );

        const initialCount = await fictionBrowserPage.getFictionCount();

        await fictionBrowserPage.changeItemsPerPage(testData.itemsPerPage);

        const newCount = await fictionBrowserPage.getFictionCount();

        expect(newCount).toBeLessThanOrEqual(testData.itemsPerPage);
        if (testData.itemsPerPage < initialCount) {
          expect(newCount).toBeLessThan(initialCount);
        }
      }
    );
  });

  test("should clear all filters", async () => {
    await ReporterHelper.executeTest(
      "TCFB007",
      "Clear All Filters",
      async () => {
        await fictionBrowserPage.openFilterModal();
        await fictionBrowserPage.selectRandomFilters();
        await fictionBrowserPage.applyFilters();

        await fictionBrowserPage.clearAllFilters();

        const filterBadges = await fictionBrowserPage.getFilterBadges();
        expect(filterBadges.length).toBe(0);
      }
    );
  });
});
