import { test, expect } from "@playwright/test";

test.describe("Smoke Tests – Inline Access Studio", () => {
  test("homepage renders and shows main heading", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await expect(page.locator("text=Claim Your Signal")).toBeVisible();
  });

  test("profile modal opens and closes", async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.locator('button[aria-label="Open profile and connection options"]').click();
    await expect(page.locator("text=Connect Your Account")).toBeVisible();
    await page.locator("text=Cancel").click();
    await expect(page.locator("text=Connect Your Account")).toHaveCount(0);
  });

  test("volume slider updates", async ({ page }) => {
    await page.goto("http://localhost:3000");
    const slider = page.locator('input[type="range"]');
    await slider.fill("0.8");
    const value = await slider.inputValue();
    expect(parseFloat(value)).toBeCloseTo(0.8);
  });

  test("cards render and are interactive", async ({ page }) => {
    await page.goto("http://localhost:3000");
    const cards = page.locator(".grid .rounded-2xl");
    await expect(cards).toHaveCount(3);
    await cards.first().click();
    await expect(page.locator("text=Signal verified on Flow")).toBeVisible();
  });
});