import * as XLSX from "xlsx";
import * as path from "path";
import * as fs from "fs";

interface TestResult {
  testId: string;
  description: string;
  status: "PASS" | "FAIL";
  duration: number;
  errorMessage?: string;
  timestamp: Date;
}

export class TestReporter {
  private results: TestResult[] = [];
  private startTime: number = 0;
  private suiteName: string;

  constructor(suiteName: string) {
    this.suiteName = suiteName;
  }

  startTest(testId: string, description: string): void {
    this.startTime = Date.now();
  }

  endTest(
    testId: string,
    description: string,
    status: "PASS" | "FAIL",
    errorMessage?: string
  ): void {
    const duration = Date.now() - this.startTime;
    this.results.push({
      testId,
      description,
      status,
      duration,
      errorMessage,
      timestamp: new Date(),
    });
  }

  getResults(): TestResult[] {
    return this.results;
  }

  exportToExcel(
    filePath: string = `./reports/${this.suiteName}_${new Date()
      .toISOString()
      .replace(/:/g, "-")}.xlsx`
  ): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const wb = XLSX.utils.book_new();

    const data = [
      [
        "Test ID",
        "Description",
        "Status",
        "Duration (ms)",
        "Error Message",
        "Timestamp",
      ],
      ...this.results.map((result) => [
        result.testId,
        result.description,
        result.status,
        result.duration,
        result.errorMessage || "",
        result.timestamp.toLocaleString(),
      ]),
    ];

    const totalTests = this.results.length;
    const passedTests = this.results.filter((r) => r.status === "PASS").length;
    const failedTests = totalTests - passedTests;
    const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    data.push([]);
    data.push(["Summary"]);
    data.push(["Total Tests", totalTests.toString()]);
    data.push(["Passed", passedTests.toString()]);
    data.push(["Failed", failedTests.toString()]);
    data.push(["Pass Rate", `${passRate.toFixed(2)}%`]);
    data.push(["Suite Name", this.suiteName]);
    data.push(["Report Generated", new Date().toLocaleString()]);

    const sheet = XLSX.utils.aoa_to_sheet(data);

    const colWidths = [
      { wch: 10 },
      { wch: 40 },
      { wch: 8 },
      { wch: 15 },
      { wch: 50 },
      { wch: 20 },
    ];
    sheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, sheet, "Test Results");

    XLSX.writeFile(wb, filePath);
    console.log(`Test report exported to: ${path.resolve(filePath)}`);
  }
}
