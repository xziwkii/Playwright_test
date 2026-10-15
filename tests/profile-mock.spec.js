const { test, expect } = require("@playwright/test");

test.use({ storageState: "playwright/.auth/user.json" });

test("profile page shows the name from the mocked response", async ({ page }) => {
  const mocked = { name: "Mockname", lastName: "Mocklastname" };

  await page.route("**/api/users/profile", async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json.data = { ...json.data, ...mocked };
    await route.fulfill({ response, json });
  });

  await page.goto("/panel/profile");

  await expect(page.locator("body")).toContainText(mocked.name);
  await expect(page.locator("body")).not.toContainText("Test");
});


test.fixme("profile page shows the mocked last name", async ({ page }) => {
  const mocked = { name: "Mockname", lastName: "Mocklastname" };

  await page.route("**/api/users/profile", async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    json.data = { ...json.data, ...mocked };
    await route.fulfill({ response, json });
  });

  await page.goto("/panel/profile");

  await expect(page.locator("body")).toContainText(mocked.lastName);
});