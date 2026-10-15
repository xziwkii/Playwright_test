const { test } = require("@playwright/test");
const HomePage = require("../pages/HomePage");
const RegistrationPage = require("../pages/RegistrationPage");
const GaragePage = require("../pages/GaragePage");

// Unique email with the "aqa" prefix, so autotest users are easy to tell apart
const user = {
  name: "Test",
  lastName: "User",
  email: `aqa-${Date.now()}@test.com`,
  password: "Passw0rdTest",
};

const PASSWORD_ERROR =
  "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter";

test.describe("qauto: registration", () => {
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    const homePage = new HomePage(page);
    registrationPage = new RegistrationPage(page);

    await homePage.open();
    await homePage.openRegistrationForm();
    await registrationPage.expectOpened();
  });

  // ---------- positive ----------
  test("registers a new user with valid data", async ({ page }) => {
    await registrationPage.fillForm(user);
    await registrationPage.expectRegisterEnabled();
    await registrationPage.submit();

    await new GaragePage(page).expectOpened();
  });

  // ---------- negative: Name and Last name ----------
  for (const [label, key] of [
    ["Name", "name"],
    ["Last name", "lastName"],
  ]) {
    test.describe(`field "${label}"`, () => {
      // NOTE: spec says "<label> is required", the app shows "<label> required"
      test("shows an error for an empty field", async () => {
        await registrationPage.fill(key, "");
        await registrationPage.expectError(key, `${label} required`);
      });

      test("shows an error for invalid data", async () => {
        await registrationPage.fill(key, "12345");
        await registrationPage.expectError(key, `${label} is invalid`);
      });

      test("shows an error when shorter than 2 characters", async () => {
        await registrationPage.fill(key, "A");
        await registrationPage.expectError(key, `${label} has to be from 2 to 20 characters long`);
      });

      test("shows an error when longer than 20 characters", async () => {
        await registrationPage.fill(key, "A".repeat(21));
        await registrationPage.expectError(key, `${label} has to be from 2 to 20 characters long`);
      });

      // KNOWN BUG: spec says spaces must be trimmed, but the app marks the field as invalid
      test.fixme("ignores spaces around the value (trim)", async () => {
        await registrationPage.fill(key, "  Test  ");
        await registrationPage.expectNoError(key);
      });
    });
  }

  // ---------- negative: Email ----------
  test("email: shows an error for an empty field", async () => {
    await registrationPage.fill("email", "");
    await registrationPage.expectError("email", "Email required");
  });

  test("email: shows an error for an incorrect email", async () => {
    await registrationPage.fill("email", "not-an-email");
    await registrationPage.expectError("email", "Email is incorrect");
  });

  // ---------- negative: Password ----------
  test("password: shows an error for an empty field", async () => {
    await registrationPage.fill("password", "");
    await registrationPage.expectError("password", "Password required");
  });

  test("password: shows an error for a weak password", async () => {
    await registrationPage.fill("password", "password");
    await registrationPage.expectError("password", PASSWORD_ERROR);
  });

  // ---------- negative: Re-enter password ----------
  test("re-enter password: shows an error for an empty field", async () => {
    await registrationPage.fill("repeat", "");
    await registrationPage.expectError("repeat", "Re-enter password required");
  });

  test("re-enter password: shows an error when passwords do not match", async () => {
    await registrationPage.fill("password", user.password);
    await registrationPage.fill("repeat", "Different1Pass");
    await registrationPage.expectError("repeat", "Passwords do not match");
  });

  // ---------- Register button ----------
  test('keeps the "Register" button disabled while the form is invalid', async () => {
    await registrationPage.expectRegisterDisabled();
    await registrationPage.fill("name", "A");
    await registrationPage.expectRegisterDisabled();
  });
});