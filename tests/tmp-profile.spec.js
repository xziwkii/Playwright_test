const { test } = require("@playwright/test");

test.use({ storageState: "playwright/.auth/user.json" });

test("tmp: real profile page text", async ({ page }) => {
  await page.goto("/panel/profile");
  await page.waitForTimeout(2000);
  const text = await page.locator("body").innerText();
  console.log("REAL PAGE TEXT:", text.replace(/\s+/g, " "));
});