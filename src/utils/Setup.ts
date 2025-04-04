import { Builder, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { beforeAll, afterAll } from "bun:test";

beforeAll(() => {
  console.log("Setting up test environment");
});

afterAll(() => {
  console.log("Tearing down test environment");
});

export async function createDriver(): Promise<WebDriver> {
  const options = new chrome.Options();

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
}
