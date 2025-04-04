import { WebDriver, By, until } from "selenium-webdriver";

export class FictionBrowserPage {
  verifyFictionsSorted(sortType: any, sortOrder: any) {
    throw new Error("Method not implemented.");
  }
  selectRandomFilters() {
    throw new Error("Method not implemented.");
  }
  private driver: WebDriver;
  private baseUrl: string;

  private searchInput = By.css('input[placeholder="Search for fictions"]');
  private filterButton = By.xpath('//button[contains(., "Filter")]');
  private filterModal = By.css(".modal-content");
  private applyFilterButton = By.className("apply-button");
  private fictionCards = By.css('[data-testid="fiction-card"]');
  private fictionTitles = By.css('[data-testid="fiction-title"]');
  private authorNames = By.css(".author-name");
  private tagElements = By.css(".tag");
  private paginationNext = By.css('button:not([disabled]):contains("Next")');
  private paginationPrevious = By.css(
    'button:not([disabled]):contains("Prev")'
  );
  private paginationInfo = By.xpath('//span[contains(text(), "Page")]');
  private itemsPerPageInput = By.css('input[aria-label="Items per page"]');
  private sortTypeSelect = By.css(".w-full.sm\\:w-60");
  private sortOrderSelect = By.css(".css-13cymwt-control");
  private clearFiltersButton = By.xpath('//button[text()="Clear All Filters"]');
  private filterBadges = By.css(".current-filters .badge");
  private authorFilterSelect = By.css('select[name="author"]');
  private tagsFilterSelect = By.css(".basic-multi-select.w-full");

  constructor(driver: WebDriver, baseUrl: string = "http://localhost:3001") {
    this.driver = driver;
    this.baseUrl = baseUrl;
  }

  async navigate(): Promise<void> {
    await this.driver.get(`${this.baseUrl}/browse`);
  }

  async searchFiction(searchTerm: string): Promise<void> {
    const searchBox = await this.driver.findElement(this.searchInput);
    await searchBox.clear();
    await searchBox.sendKeys(searchTerm);
    await this.driver.sleep(500);
  }

  async getFictionTitles(): Promise<string[]> {
    const titles = await this.driver.findElements(this.fictionTitles);
    return Promise.all(titles.map((title) => title.getText()));
  }

  async getAuthorNames(): Promise<string[]> {
    const authors = await this.driver.findElements(this.authorNames);
    return Promise.all(authors.map((author) => author.getText()));
  }

  async openFilterModal(): Promise<void> {
    await this.driver.findElement(this.filterButton).click();
    await this.driver.sleep(500);
  }

  async selectAuthorFilter(authorName: string): Promise<void> {
    const authorFilter = await this.driver.findElement(this.authorFilterSelect);
    await authorFilter.click();
    const option = await this.driver.findElement(
      By.xpath(
        `//div[contains(@class, "css-") and contains(., "${authorName}")]`
      )
    );
    await option.click();
  }

  async selectTags(tags: string[]): Promise<void> {
    const tagsFilter = await this.driver.findElement(this.tagsFilterSelect);
    await tagsFilter.click();

    await this.driver.sleep(500);

    for (const tag of tags) {
      await this.driver.executeScript(`
        // Find all options in the dropdown
        const options = Array.from(document.querySelectorAll('.select__option'));
        
        // Find the option containing the tag text
        const option = options.find(opt => opt.textContent.includes("${tag}"));
        
        // Click the option if found
        if (option) {
          option.click();
        } else {
          console.error("Could not find option with text: ${tag}");
        }
      `);

      await this.driver.sleep(300);
    }

    await this.driver.executeScript(`
      // Click on body to close dropdown
      document.body.click();
    `);

    await this.driver.sleep(200);
  }

  async applyFilters(): Promise<void> {
    await this.driver.findElement(this.applyFilterButton).click();
    await this.driver.sleep(1000);
  }

  async verifyFictionsHaveTags(tags: string[]): Promise<boolean> {
    const fictionCards = await this.driver.findElements(this.fictionCards);

    for (const card of fictionCards) {
      const cardTags = await card.findElements(this.tagElements);
      const cardTagTexts = await Promise.all(
        cardTags.map((tag) => tag.getText())
      );

      const hasTag = tags.some((tag) =>
        cardTagTexts.some((cardTag) => cardTag.includes(tag))
      );

      if (!hasTag) return false;
    }

    return true;
  }

  async selectSortType(sortType: string): Promise<void> {
    const sortTypeContainer = await this.driver.findElements(
      this.sortTypeSelect
    );
    await sortTypeContainer[0].click();

    await this.driver.sleep(300);

    await this.driver.executeScript(`
      // Find all options in the dropdown
      const options = Array.from(document.querySelectorAll('.css-1dimb5e-singleValue, .css-1n6sfyn-MenuList div'));
      
      // Find the option containing the sort type text
      const option = options.find(opt => opt.textContent.includes("${sortType}"));
      
      // Click the option if found
      if (option) {
        option.click();
      } else {
        console.error("Could not find sort type option: ${sortType}");
      }
    `);

    await this.driver.sleep(200);
  }

  async selectSortOrder(sortOrder: "Ascending" | "Descending"): Promise<void> {
    const sortControls = await this.driver.findElements(this.sortOrderSelect);
    if (sortControls.length >= 2) {
      await sortControls[1].click();
    } else {
      await this.driver.findElement(By.id("react-select-31-input")).click();
    }

    await this.driver.sleep(300);

    await this.driver.executeScript(`
      // Find all options in the dropdown
      const options = Array.from(document.querySelectorAll('.css-1n6sfyn-MenuList div'));
      
      // Find the option containing the sort order text
      const option = options.find(opt => opt.textContent.includes("${sortOrder}"));
      
      // Click the option if found
      if (option) {
        option.click();
      } else {
        console.error("Could not find sort order option: ${sortOrder}");
      }
    `);

    await this.driver.sleep(200);
  }

  async goToNextPage(): Promise<void> {
    const nextButton = await this.driver.findElement(
      By.xpath('//button[text()="Next"]')
    );
    if (!(await nextButton.getAttribute("disabled"))) {
      await nextButton.click();
      await this.driver.sleep(1000);
    }
  }

  async goToPreviousPage(): Promise<void> {
    const prevButton = await this.driver.findElement(
      By.xpath('//button[text()="Prev"]')
    );
    if (!(await prevButton.getAttribute("disabled"))) {
      await prevButton.click();
      await this.driver.sleep(1000);
    }
  }

  async getCurrentPage(): Promise<number> {
    const pageInfo = await this.driver.findElement(this.paginationInfo);
    const pageText = await pageInfo.getText();
    const match = pageText.match(/Page (\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }

  async getFictionCount(): Promise<number> {
    const cards = await this.driver.findElements(this.fictionCards);
    return cards.length;
  }

  async changeItemsPerPage(count: number): Promise<void> {
    const input = await this.driver.findElement(this.itemsPerPageInput);
    await input.clear();
    await input.sendKeys(count.toString());
    await input.sendKeys("\n");
    await this.driver.sleep(1000);
  }

  async clearAllFilters(): Promise<void> {
    if (
      (await (await this.driver.findElements(this.clearFiltersButton)).length) >
      0
    ) {
      await this.driver.findElement(this.clearFiltersButton).click();
      await this.driver.sleep(500);
    }
  }

  async getFilterBadges(): Promise<string[]> {
    const badges = await this.driver.findElements(this.filterBadges);
    return Promise.all(badges.map((badge) => badge.getText()));
  }
}
