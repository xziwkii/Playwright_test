const { test, expect } = require("@playwright/test");

// The built-in `request` fixture is an APIRequestContext that uses baseURL,
// HTTP credentials from the config and the saved session of the logged-in user
test.use({ storageState: "playwright/.auth/user.json" });

const validCar = { carBrandId: 1, carModelId: 1, mileage: 100 };

test.describe("API: POST /api/cars", () => {
  test("creates a car with valid data", async ({ request }) => {
    const response = await request.post("/api/cars", { data: validCar });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(201);
    expect(body.status).toBe("ok");
    expect(body.data).toMatchObject({
      carBrandId: validCar.carBrandId,
      carModelId: validCar.carModelId,
      mileage: validCar.mileage,
    });
    expect(typeof body.data.id).toBe("number");

    // Cleanup: remove the car created by the test
    await request.delete(`/api/cars/${body.data.id}`);
  });

  test("rejects a request without a required field", async ({ request }) => {
    const response = await request.post("/api/cars", {
      data: { carModelId: 1, mileage: 100 },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.status).toBe("error");
  });

  test("rejects a car with a negative mileage", async ({ request }) => {
    const response = await request.post("/api/cars", {
      data: { ...validCar, mileage: -5 },
    });
    const body = await response.json();

    expect(response.status(), JSON.stringify(body)).toBe(400);
    expect(body.status).toBe("error");
  });

  test.fixme("rejects a request from an unauthorized user", async ({
    playwright,
    baseURL,
    httpCredentials,
  }) => {
    // A new context with no session cookie: only the HTTP credentials of the site
    const anonymous = await playwright.request.newContext({ baseURL, httpCredentials });

    const response = await anonymous.post("/api/cars", { data: validCar });
    expect(response.status()).toBe(401);

    await anonymous.dispose();
  });
});