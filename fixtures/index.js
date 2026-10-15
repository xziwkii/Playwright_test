const base = require("@playwright/test");
const GaragePage = require("../pages/GaragePage");

const authFile = "playwright/.auth/user.json";

exports.test = base.test.extend({
  // GaragePage of the logged-in user: the context starts with the saved storage state
  userGaragePage: async ({ browser, baseURL, httpCredentials }, use) => {
    const context = await browser.newContext({
      storageState: authFile,
      baseURL,
      httpCredentials,
    });
    const page = await context.newPage();
    const garagePage = new GaragePage(page);

    await garagePage.open();
    await use(garagePage);

    await context.close();
  },
});

exports.expect = base.expect;