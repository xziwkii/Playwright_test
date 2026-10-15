const { test: setup } = require("@playwright/test");
const HomePage = require("../pages/HomePage");
const LoginPage = require("../pages/LoginPage");
const RegistrationPage = require("../pages/RegistrationPage");
const GaragePage = require("../pages/GaragePage");

const authFile = "playwright/.auth/user.json";

setup("authenticate user and save storage state", async ({ page }) => {
  const { USER_EMAIL, USER_PASSWORD } = process.env;
  if (!USER_EMAIL || !USER_PASSWORD) {
    throw new Error("Missing env variables: USER_EMAIL, USER_PASSWORD");
  }

  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const garagePage = new GaragePage(page);

  await homePage.open();
  await homePage.openLoginForm();
  await loginPage.login(USER_EMAIL, USER_PASSWORD);

  const loggedIn = await page
    .waitForURL(/\/panel\/garage/, { timeout: 5000 })
    .then(() => true, () => false);

  if (!loggedIn) {
    // First run: the user does not exist yet, so register it (lands on the garage page)
    const registrationPage = new RegistrationPage(page);
    await homePage.open();
    await homePage.openRegistrationForm();
    await registrationPage.fillForm({
      name: "Test",
      lastName: "User",
      email: USER_EMAIL,
      password: USER_PASSWORD,
    });
    await registrationPage.submit();
  }

  await garagePage.expectOpened();
  await page.context().storageState({ path: authFile });
});