import * as XLSX from "xlsx";
import * as path from "path";

export class ExcelDataReader {
  private workbook: XLSX.WorkBook;

  constructor(filePath: string) {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);

    this.workbook = XLSX.readFile(absolutePath);
  }

  getJsonFromCell(sheetName: string, cellAddress: string): any {
    // const sheet = this.workbook.Sheets[sheetName];
    // if (!sheet) {
    //   throw new Error(`Sheet "${sheetName}" not found in the workbook`);
    // }

    // const cellValue = sheet[cellAddress]?.v;
    // if (!cellValue) {
    //   throw new Error(
    //     `Cell ${cellAddress} is empty or doesn't exist in sheet "${sheetName}"`
    //   );
    // }

    // try {
    //   return JSON.parse(String(cellValue));
    // } catch (error) {
    //   throw new Error(
    //     `Failed to parse JSON from cell ${cellAddress} (value: ${cellValue}): ${error}`
    //   );
    // }

    throw new Error("Not implemented yet");
  }

  getTestCaseData(
    sheetName: string,
    testCaseId: string,
    dataColumn: string
  ): any {
    const sheet = this.workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found in the workbook`);
    }

    const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:Z100");

    for (let r = range.s.r; r <= range.e.r; r++) {
      const cellAddress = XLSX.utils.encode_cell({ r, c: 0 });
      const cell = sheet[cellAddress];

      if (cell && cell.v === testCaseId) {
        const dataColumnIndex = dataColumn.charCodeAt(0) - 65;
        const dataCellAddress = XLSX.utils.encode_cell({
          r,
          c: dataColumnIndex,
        });

        try {
          const jsonData = sheet[dataCellAddress]?.v;
          return JSON.parse(String(jsonData));
        } catch (error) {
          throw new Error(
            `Failed to parse JSON data for test case ${testCaseId}: ${error}`
          );
        }
      }
    }

    throw new Error(
      `Test case "${testCaseId}" not found in sheet "${sheetName}"`
    );
  }

  listTestCases(sheetName: string): string[] {
    // const sheet = this.workbook.Sheets[sheetName];
    // if (!sheet) {
    //   throw new Error(`Sheet "${sheetName}" not found in the workbook`);
    // }

    // const testCases: string[] = [];
    // const range = XLSX.utils.decode_range(sheet["!ref"] || "A1:A100");

    // for (let r = 1; r <= range.e.r; r++) {
    //   const cellAddress = XLSX.utils.encode_cell({ r, c: 0 });
    //   const cell = sheet[cellAddress];

    //   if (cell && cell.v) {
    //     testCases.push(String(cell.v));
    //   }
    // }

    // return testCases;

    throw new Error("Not implemented yet");
  }
}
