// @ts-check
const { defineConfig, devices } = require("@playwright/test");

// Load variables from .env (variables already set in the shell take priority)
require("dotenv").config({ quiet: true });

const { BASE_URL, HTTP_USERNAME, HTTP_PASSWORD } = process.env;

if (!BASE_URL || !HTTP_USERNAME || !HTTP_PASSWORD) {
  throw new Error(
    "Missing env variables: BASE_URL, HTTP_USERNAME, HTTP_PASSWORD. Copy .env.example to .env and fill it in."
  );
}

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    httpCredentials: { username: HTTP_USERNAME, password: HTTP_PASSWORD },
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    // Setup project: logs in once and saves the storage state
    { name: "setup", testMatch: /.*\.setup\.js/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
});