import { Builder, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { beforeAll, afterAll } from "bun:test";

// This will run before all tests
beforeAll(() => {
  console.log("Setting up test environment");
});

// This will run after all tests
afterAll(() => {
  console.log("Tearing down test environment");
});

// Helper function to create WebDriver instance
export async function createDriver(): Promise<WebDriver> {
  const options = new chrome.Options();

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}
