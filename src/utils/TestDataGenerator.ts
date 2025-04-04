import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

interface SignUpTestData {
  username: string;
  email: string;
  password: string;
}

interface SignInTestData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

interface ProfileTestData {
  name: string;
  bio: string;
  location: string;
}

interface PasswordChangeTestData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

class TestDataGenerator {
  generateSignUpTestData(): { [key: string]: SignUpTestData } {
    return {
      validData: {
        username: "validuser",
        email: "test@himmel.com",
        password: "Password123!",
      },
      invalidEmail: {
        username: "invalidemailuser",
        email: "invalid-email@himmel",
        password: "Password123!",
      },
      weakPassword: {
        username: "weakpassuser",
        email: "weak@himmel.com",
        password: "weak",
      },
      duplicateUser: {
        username: "duplicateuser",
        email: "duplicate@himmel.com",
        password: "Password123!",
      },
    };
  }

  generateSignInTestData(): { [key: string]: SignInTestData } {
    return {
      validSignIn: {
        username: "admin",
        password: "0911Kiet@",
        rememberMe: true,
      },
      invalidPassword: {
        username: "admin",
        password: "wrongpassword",
        rememberMe: false,
      },
      nonExistentUser: {
        username: "nonexistentuser",
        password: "Password123!",
        rememberMe: false,
      },
    };
  }

  generateProfileTestData(): { [key: string]: ProfileTestData } {
    return {
      validProfile: {
        name: "John Doe",
        bio: "Software engineer with 10+ years of experience",
        location: "San Francisco, CA",
      },
      longBio: {
        name: "Jane Smith",
        bio: "A".repeat(500),
        location: "New York, NY",
      },
    };
  }

  generatePasswordChangeTestData(): { [key: string]: PasswordChangeTestData } {
    return {
      validChange: {
        currentPassword: "0911Kiet@",
        newPassword: "NewPassword456@",
        confirmNewPassword: "NewPassword456@",
      },
      incorrectCurrentPassword: {
        currentPassword: "WrongPassword123!",
        newPassword: "NewPassword456@",
        confirmNewPassword: "NewPassword456@",
      },
      weakNewPassword: {
        currentPassword: "Password123!",
        newPassword: "weak",
        confirmNewPassword: "weak",
      },
      passwordMismatch: {
        currentPassword: "Password123!",
        newPassword: "NewPassword456@",
        confirmNewPassword: "DifferentPassword789#",
      },
      samePassword: {
        currentPassword: "0911Kiet@",
        newPassword: "0911Kiet@",
        confirmNewPassword: "0911Kiet@",
      },
    };
  }

  generateFictionBrowserTestData(): { [key: string]: any } {
    return {
      searchByTitle: {
        searchTerm: "I Shaved",
      },
      filterByAuthor: {
        authorName: "John Doe",
      },
      filterByTags: {
        tags: ["Fantasy", "Adventure"],
      },
      sortFictions: {
        sortType: "createdAt",
        sortOrder: "desc",
      },
      changeItemsPerPage: {
        itemsPerPage: 6,
      },
    };
  }

  generateAllTestData(outputPath: string = "./test-data/test-data.xlsx"): void {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const wb = XLSX.utils.book_new();

    const signUpData = this.generateSignUpTestData();
    const signUpSheet = XLSX.utils.aoa_to_sheet([
      ["TestCaseID", "Description", "Expected Result", "TestData"],
      [
        "TC001",
        "Valid Registration",
        "User should be successfully registered",
        JSON.stringify(signUpData.validData),
      ],
      [
        "TC002",
        "Invalid Email Format",
        "System should show email format error",
        JSON.stringify(signUpData.invalidEmail),
      ],
      [
        "TC003",
        "Weak Password",
        "System should show password strength error",
        JSON.stringify(signUpData.weakPassword),
      ],
      [
        "TC004",
        "Duplicate Username",
        "System should show username taken error",
        JSON.stringify(signUpData.duplicateUser),
      ],
    ]);
    XLSX.utils.book_append_sheet(wb, signUpSheet, "SignUpTests");

    const signInData = this.generateSignInTestData();
    const signInSheet = XLSX.utils.aoa_to_sheet([
      ["TestCaseID", "Description", "Expected Result", "TestData"],
      [
        "TC001",
        "Valid Sign In",
        "User should be successfully signed in",
        JSON.stringify(signInData.validSignIn),
      ],
      [
        "TC002",
        "Invalid Password",
        "System should show invalid credentials error",
        JSON.stringify(signInData.invalidPassword),
      ],
      [
        "TC003",
        "Non-existent User",
        "System should show user not found error",
        JSON.stringify(signInData.nonExistentUser),
      ],
    ]);
    XLSX.utils.book_append_sheet(wb, signInSheet, "SignInTests");

    const passwordChangeData = this.generatePasswordChangeTestData();
    const passwordChangeSheet = XLSX.utils.aoa_to_sheet([
      ["TestCaseID", "Description", "Expected Result", "TestData"],
      [
        "TC001",
        "Valid Password Change",
        "Password should be successfully changed",
        JSON.stringify(passwordChangeData.validChange),
      ],
      [
        "TC002",
        "Incorrect Current Password",
        "System should show current password incorrect error",
        JSON.stringify(passwordChangeData.incorrectCurrentPassword),
      ],
      [
        "TC003",
        "Weak New Password",
        "System should show password strength error",
        JSON.stringify(passwordChangeData.weakNewPassword),
      ],
      [
        "TC004",
        "Passwords Don't Match",
        "System should show passwords mismatch error",
        JSON.stringify(passwordChangeData.passwordMismatch),
      ],
      [
        "TC005",
        "New Password Same as Current",
        "System should show new password must be different error",
        JSON.stringify(passwordChangeData.samePassword),
      ],
    ]);
    XLSX.utils.book_append_sheet(
      wb,
      passwordChangeSheet,
      "PasswordChangeTests"
    );

    const fictionBrowserData = this.generateFictionBrowserTestData();
    const fictionBrowserSheet = XLSX.utils.aoa_to_sheet([
      ["TestCaseID", "Description", "Expected Result", "TestData"],
      [
        "TCFB001",
        "Search Fiction By Title",
        "Should display fiction titles containing the search term",
        JSON.stringify(fictionBrowserData.searchByTitle),
      ],
      [
        "TCFB002",
        "Filter Fiction By Author",
        "Should display only fictions by the selected author",
        JSON.stringify(fictionBrowserData.filterByAuthor),
      ],
      [
        "TCFB003",
        "Filter Fiction By Tags",
        "Should display only fictions that have the selected tags",
        JSON.stringify(fictionBrowserData.filterByTags),
      ],
      [
        "TCFB004",
        "Sort Fictions",
        "Should display fictions sorted by the selected criteria",
        JSON.stringify(fictionBrowserData.sortFictions),
      ],
      [
        "TCFB005",
        "Pagination Navigation",
        "Should navigate between pages and display different fiction sets",
        "{}",
      ],
      [
        "TCFB006",
        "Change Items Per Page",
        "Should change the number of fictions displayed per page",
        JSON.stringify(fictionBrowserData.changeItemsPerPage),
      ],
      [
        "TCFB007",
        "Clear All Filters",
        "Should remove all applied filters",
        "{}",
      ],
    ]);
    XLSX.utils.book_append_sheet(
      wb,
      fictionBrowserSheet,
      "FictionBrowserTests"
    );

    XLSX.writeFile(wb, outputPath);

    console.log(
      `Test data Excel file generated at: ${path.resolve(outputPath)}`
    );
  }
}

export {
  TestDataGenerator,
  SignUpTestData,
  SignInTestData,
  ProfileTestData,
  PasswordChangeTestData,
};
