class HomePage {
  constructor(page) {
    this.page = page;
    this.signUpButton = page.getByRole("button", { name: "Sign up" }).first();
    this.signInButton = page.getByRole("button", { name: /sign in/i }).first();
  }

  async open() {
    await this.page.goto("/");
  }

  async openRegistrationForm() {
    await this.signUpButton.click();
  }

  async openLoginForm() {
    await this.signInButton.click();
  }
}

module.exports = HomePage;