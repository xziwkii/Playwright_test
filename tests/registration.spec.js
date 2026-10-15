const { test, expect } = require("@playwright/test");

// Unique email with the "aqa" prefix, so autotest users are easy to tell apart
const user = {
  name: "Test",
  lastName: "User",
  email: `aqa-${Date.now()}@test.com`,
  password: "Passw0rdTest",
};

const ids = {
  name: "#signupName",
  lastName: "#signupLastName",
  email: "#signupEmail",
  password: "#signupPassword",
  repeat: "#signupRepeatPassword",
};

const RED = "rgb(220, 53, 69)";
const PASSWORD_ERROR =
  "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter";

async function openRegistration(page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Sign up" }).first().click();
  await expect(page.locator(ids.name)).toBeVisible();
}

async function fillField(page, selector, value) {
  const field = page.locator(selector);
  if (value === "") {
    await field.focus();
  } else {
    await field.fill(value);
  }
  await field.blur();
}

async function expectError(page, selector, message) {
  const field = page.locator(selector);
  await expect(field).toHaveClass(/is-invalid/);
  await expect(field).toHaveCSS("border-color", RED);
  await expect(page.locator(`${selector} ~ .invalid-feedback`)).toContainText(message);
}

test.describe("qauto: registration", () => {
  test.beforeEach(async ({ page }) => {
    await openRegistration(page);
  });

  // ---------- positive ----------
  test("registers a new user with valid data", async ({ page }) => {
    await fillField(page, ids.name, user.name);
    await fillField(page, ids.lastName, user.lastName);
    await fillField(page, ids.email, user.email);
    await fillField(page, ids.password, user.password);
    await fillField(page, ids.repeat, user.password);

    const registerButton = page.locator(".modal-footer button", { hasText: "Register" });
    await expect(registerButton).toBeEnabled();
    await registerButton.click();

    await expect(page).toHaveURL(/\/panel\/garage/);
  });

  // ---------- negative: Name and Last name ----------
  for (const [label, selector] of [
    ["Name", ids.name],
    ["Last name", ids.lastName],
  ]) {
    test.describe(`field "${label}"`, () => {
      // NOTE: spec says "<label> is required", the app shows "<label> required"
      test("shows an error for an empty field", async ({ page }) => {
        await fillField(page, selector, "");
        await expectError(page, selector, `${label} required`);
      });

      test("shows an error for invalid data", async ({ page }) => {
        await fillField(page, selector, "12345");
        await expectError(page, selector, `${label} is invalid`);
      });

      test("shows an error when shorter than 2 characters", async ({ page }) => {
        await fillField(page, selector, "A");
        await expectError(page, selector, `${label} has to be from 2 to 20 characters long`);
      });

      test("shows an error when longer than 20 characters", async ({ page }) => {
        await fillField(page, selector, "A".repeat(21));
        await expectError(page, selector, `${label} has to be from 2 to 20 characters long`);
      });

      // KNOWN BUG: spec says spaces must be trimmed, but the app marks the field as invalid
      test.fixme("ignores spaces around the value (trim)", async ({ page }) => {
        await fillField(page, selector, "  Test  ");
        await expect(page.locator(selector)).not.toHaveClass(/is-invalid/);
      });
    });
  }

  // ---------- negative: Email ----------
  test("email: shows an error for an empty field", async ({ page }) => {
    await fillField(page, ids.email, "");
    await expectError(page, ids.email, "Email required");
  });

  test("email: shows an error for an incorrect email", async ({ page }) => {
    await fillField(page, ids.email, "not-an-email");
    await expectError(page, ids.email, "Email is incorrect");
  });

  // ---------- negative: Password ----------
  test("password: shows an error for an empty field", async ({ page }) => {
    await fillField(page, ids.password, "");
    await expectError(page, ids.password, "Password required");
  });

  test("password: shows an error for a weak password", async ({ page }) => {
    await fillField(page, ids.password, "password");
    await expectError(page, ids.password, PASSWORD_ERROR);
  });

  // ---------- negative: Re-enter password ----------
  test("re-enter password: shows an error for an empty field", async ({ page }) => {
    await fillField(page, ids.repeat, "");
    await expectError(page, ids.repeat, "Re-enter password required");
  });

  test("re-enter password: shows an error when passwords do not match", async ({ page }) => {
    await fillField(page, ids.password, user.password);
    await fillField(page, ids.repeat, "Different1Pass");
    await expectError(page, ids.repeat, "Passwords do not match");
  });

  // ---------- Register button ----------
  test('keeps the "Register" button disabled while the form is invalid', async ({ page }) => {
    const registerButton = page.locator(".modal-footer button", { hasText: "Register" });
    await expect(registerButton).toBeDisabled();
    await fillField(page, ids.name, "A");
    await expect(registerButton).toBeDisabled();
  });
});