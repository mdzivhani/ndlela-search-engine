import { test, expect } from "@playwright/test";
test("public discovery loads a catalogue and persists a guest favourite", async ({
  page,
}) => {
  await page.goto("/search");
  await expect(
    page.getByRole("heading", { name: "Find your next favourite place." }),
  ).toBeVisible();
  await expect(page.locator(".place-card").first()).toBeVisible();
  const name = await page.locator(".place-card h3").first().innerText();
  await page.locator(".save-place").first().click();
  await page.goto("/favourites");
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
});
test("destination and price filters survive a reload", async ({ page }) => {
  await page.goto("/search?q=Cape+Town&maxPrice=500");
  await expect(page.locator(".place-card").first()).toBeVisible();
  await expect(page.getByLabel("Destination or experience")).toHaveValue(
    "Cape Town",
  );
  await page.getByRole("button", { name: /Filters/ }).click();
  await expect(page.getByLabel("Maximum price (R)")).toHaveValue("500");
  await page.reload();
  await expect(page.getByLabel("Destination or experience")).toHaveValue(
    "Cape Town",
  );
});
test("planner returns a budgeted itinerary", async ({ page }) => {
  await page.goto("/planner");
  await page.getByLabel("Destination", { exact: true }).fill("Cape Town");
  await page.getByRole("button", { name: "Build my itinerary" }).click();
  await expect(
    page.getByRole("heading", { name: "Cape Town getaway" }),
  ).toBeVisible();
  await expect(page.locator(".itinerary-stop").first()).toBeVisible();
  await expect(page.getByText(/Prices are estimates per person/)).toBeVisible();
});
test("mobile pages fit the viewport and navigation remains available", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/", "/search", "/planner", "/business/1"]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBeTruthy();
    await expect(
      page.getByRole("navigation", { name: "Mobile navigation" }),
    ).toBeVisible();
  }
});
