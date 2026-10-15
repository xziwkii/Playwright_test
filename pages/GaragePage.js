const { expect } = require("@playwright/test");

class GaragePage {
  constructor(page) {
    this.page = page;
  }

  async expectOpened() {
    await expect(this.page).toHaveURL(/\/panel\/garage/);
  }
}

module.exports = GaragePage;