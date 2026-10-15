const { expect } = require("@playwright/test");

const SELECTORS = {
  name: "#signupName",
  lastName: "#signupLastName",
  email: "#signupEmail",
  password: "#signupPassword",
  repeat: "#signupRepeatPassword",
};

const RED = "rgb(220, 53, 69)";

class RegistrationPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator(".modal-title");
    this.registerButton = page.locator(".modal-footer button", { hasText: "Register" });
  }

  field(key) {
    return this.page.locator(SELECTORS[key]);
  }

  errorMessage(key) {
    return this.page.locator(`${SELECTORS[key]} ~ .invalid-feedback`);
  }

  // Empty value only focuses and blurs the field, so the "required" error is triggered
  async fill(key, value) {
    const field = this.field(key);
    if (value === "") {
      await field.focus();
    } else {
      await field.fill(value);
    }
    await field.blur();
  }

  async fillForm(user) {
    await this.fill("name", user.name);
    await this.fill("lastName", user.lastName);
    await this.fill("email", user.email);
    await this.fill("password", user.password);
    await this.fill("repeat", user.password);
  }

  async submit() {
    await this.registerButton.click();
  }

  async expectOpened() {
    await expect(this.field("name")).toBeVisible();
  }

  async expectError(key, message) {
    await expect(this.field(key)).toHaveClass(/is-invalid/);
    await expect(this.field(key)).toHaveCSS("border-color", RED);
    await expect(this.errorMessage(key)).toContainText(message);
  }

  async expectNoError(key) {
    await expect(this.field(key)).not.toHaveClass(/is-invalid/);
  }

  async expectRegisterEnabled() {
    await expect(this.registerButton).toBeEnabled();
  }

  async expectRegisterDisabled() {
    await expect(this.registerButton).toBeDisabled();
  }
}

module.exports = RegistrationPage;