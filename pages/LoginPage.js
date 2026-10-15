class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator("#signinEmail");
    this.password = page.locator("#signinPassword");
    this.loginButton = page.locator(".modal-footer button", { hasText: "Login" });
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

module.exports = LoginPage;