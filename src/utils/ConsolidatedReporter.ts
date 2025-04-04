import * as XLSX from "xlsx";
import * as path from "path";
import * as fs from "fs";
import { glob } from "glob";

interface ConsolidatedTestResult {
  testId: string;
  description: string;
  status: "PASS" | "FAIL";
  duration: number;
  errorMessage?: string;
  timestamp: string;
  suiteName: string;
}

interface SuiteSummary {
  suiteName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  passRate: number;
}

export class ConsolidatedReporter {
  private reportsDir: string;
  private outputPath: string;

  constructor(
    reportsDir: string = path.resolve("./reports"),
    outputPath: string = path.resolve(
      `./reports/consolidated_report_${new Date()
        .toISOString()
        .replace(/:/g, "-")}.xlsx`
    )
  ) {
    this.reportsDir = reportsDir;
    this.outputPath = outputPath;
    console.log(`Using reports directory: ${this.reportsDir}`);
    console.log(`Output will be written to: ${this.outputPath}`);
  }

  private async findReportFiles(): Promise<string[]> {
    if (!fs.existsSync(this.reportsDir)) {
      console.error(`Reports directory does not exist: ${this.reportsDir}`);
      return [];
    }

    const allFiles = fs
      .readdirSync(this.reportsDir)
      .map((file) => path.join(this.reportsDir, file))
      .filter((file) => {
        return (
          fs.statSync(file).isFile() &&
          !path.basename(file).startsWith("consolidated_")
        );
      });

    console.log(`All files found in ${this.reportsDir}:`, allFiles);

    return allFiles;
  }

  private extractDataFromReport(filePath: string): {
    results: ConsolidatedTestResult[];
    suiteName: string;
  } {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

    let suiteName = path.basename(filePath).split("_")[0];

    for (let i = 0; i < rawData.length; i++) {
      const row = rawData[i];
      if (row && row[0] === "Suite Name" && row[1]) {
        suiteName = row[1];
        break;
      }
    }

    const results: ConsolidatedTestResult[] = [];
    let inResultsSection = true;

    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];

      if (!row || !row.length || row[0] === "Summary") {
        inResultsSection = false;
        continue;
      }

      if (inResultsSection && row.length >= 5) {
        results.push({
          testId: row[0],
          description: row[1],
          status: row[2],
          duration: row[3],
          errorMessage: row[4],
          timestamp: row[5],
          suiteName: suiteName,
        });
      }
    }

    return { results, suiteName };
  }

  public async generateConsolidatedReport(): Promise<void> {
    const reportFiles = await this.findReportFiles();
    console.log(`Found ${reportFiles.length} test report files`);

    if (reportFiles.length === 0) {
      console.log("No report files found. Exiting.");
      return;
    }

    const allResults: ConsolidatedTestResult[] = [];
    const suiteSummaries: SuiteSummary[] = [];

    reportFiles.forEach((file) => {
      try {
        const { results, suiteName } = this.extractDataFromReport(file);
        allResults.push(...results);

        const totalTests = results.length;
        const passedTests = results.filter((r) => r.status === "PASS").length;
        const failedTests = totalTests - passedTests;
        const passRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

        suiteSummaries.push({
          suiteName,
          totalTests,
          passedTests,
          failedTests,
          passRate,
        });

        console.log(`Processed ${file}: ${results.length} test results`);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    });

    this.createConsolidatedExcel(allResults, suiteSummaries);
  }

  private createConsolidatedExcel(
    allResults: ConsolidatedTestResult[],
    suiteSummaries: SuiteSummary[]
  ): void {
    const dir = path.dirname(this.outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const wb = XLSX.utils.book_new();

    const resultsData = [
      [
        "Suite",
        "Test ID",
        "Description",
        "Status",
        "Duration (ms)",
        "Error Message",
        "Timestamp",
      ],
      ...allResults.map((result) => [
        result.suiteName,
        result.testId,
        result.description,
        result.status,
        result.duration,
        result.errorMessage || "",
        result.timestamp,
      ]),
    ];

    const totalTests = allResults.length;
    const passedTests = allResults.filter((r) => r.status === "PASS").length;
    const failedTests = totalTests - passedTests;
    const overallPassRate =
      totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

    resultsData.push([]);
    resultsData.push(["OVERALL SUMMARY"]);
    resultsData.push(["Total Tests", totalTests.toString()]);
    resultsData.push(["Passed", passedTests.toString()]);
    resultsData.push(["Failed", failedTests.toString()]);
    resultsData.push(["Pass Rate", `${overallPassRate.toFixed(2)}%`]);
    resultsData.push(["Report Generated", new Date().toLocaleString()]);

    const resultsSheet = XLSX.utils.aoa_to_sheet(resultsData);

    const resultsColWidths = [
      { wch: 20 },
      { wch: 10 },
      { wch: 40 },
      { wch: 8 },
      { wch: 15 },
      { wch: 50 },
      { wch: 20 },
    ];
    resultsSheet["!cols"] = resultsColWidths;

    const summaryData = [
      ["Suite Name", "Total Tests", "Passed", "Failed", "Pass Rate"],
      ...suiteSummaries.map((suite) => [
        suite.suiteName,
        suite.totalTests,
        suite.passedTests,
        suite.failedTests,
        `${suite.passRate.toFixed(2)}%`,
      ]),
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    const summaryColWidths = [
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    summarySheet["!cols"] = summaryColWidths;

    XLSX.utils.book_append_sheet(wb, summarySheet, "Suite Summary");
    XLSX.utils.book_append_sheet(wb, resultsSheet, "All Test Results");

    XLSX.writeFile(wb, this.outputPath);
    console.log(
      `Consolidated report exported to: ${path.resolve(this.outputPath)}`
    );
  }
}
