const { test, expect } = require("../fixtures");

test.describe("garage of the logged-in user", () => {
  test("opens the garage without logging in again", async ({ userGaragePage }) => {
    await userGaragePage.expectOpened();
  });

  test("shows the Add car button", async ({ userGaragePage }) => {
    await expect(userGaragePage.addCarButton).toBeVisible();
  });
});