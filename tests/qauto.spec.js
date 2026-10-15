const { test, expect } = require("@playwright/test");

test("home page opens and shows the Sign In button", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
});