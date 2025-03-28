export const settings = {
  browser: "chrome",
  timeout: 30000,
  baseUrl: "http://localhost:3000",
  headless: false,
};

export const testConfig = {
  baseUrl: process.env.BASE_URL || "http://localhost:3001",
  timeouts: {
    implicit: 5000,
    explicit: 10000,
    pageLoad: 30000,
  },
  users: {
    standard: {
      username: process.env.TEST_USER || "user",
      email: process.env.TEST_EMAIL || "user@himmel.com",
      password: process.env.TEST_PASSWORD || "passWord123@",
    },
    admin: {
      username: process.env.ADMIN_USER || "admin",
      email: process.env.ADMIN_EMAIL || "admin@himmel.com",
      password: process.env.ADMIN_PASSWORD || "passWord123@",
    },
  },
};
