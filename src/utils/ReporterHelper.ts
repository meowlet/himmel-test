import { TestReporter } from "./TestReporter";

export class ReporterHelper {
  private static reporter: TestReporter | null = null;

  static initReporter(suiteName: string): TestReporter {
    this.reporter = new TestReporter(suiteName);
    return this.reporter;
  }

  static getReporter(): TestReporter {
    if (!this.reporter) {
      throw new Error("Reporter not initialized. Call initReporter first.");
    }
    return this.reporter;
  }

  static async executeTest(
    testId: string,
    description: string,
    testFn: () => Promise<void>
  ): Promise<void> {
    if (!this.reporter) {
      throw new Error("Reporter not initialized. Call initReporter first.");
    }

    this.reporter.startTest(testId, description);
    try {
      await testFn();
      this.reporter.endTest(testId, description, "PASS");
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.reporter.endTest(testId, description, "FAIL", errorMsg);
      throw error;
    }
  }

  static async verifyCondition(
    condition: boolean,
    message: string
  ): Promise<void> {
    if (!condition) {
      throw new Error(message);
    }
  }

  static resetReporter(): void {
    this.reporter = null;
  }

  static exportReport(filePath?: string): void {
    if (this.reporter) {
      this.reporter.exportToExcel(filePath);
    }
  }
}
