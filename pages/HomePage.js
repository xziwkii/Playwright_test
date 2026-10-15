class HomePage {
  constructor(page) {
    this.page = page;
    this.signUpButton = page.getByRole("button", { name: "Sign up" }).first();
  }

  async open() {
    await this.page.goto("/");
  }

  async openRegistrationForm() {
    await this.signUpButton.click();
  }
}

module.exports = HomePage;