import { test, expect } from "@playwright/test";

test("Arabic welcome and protected route", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: /اهتمام أنسب/ })).toBeVisible();
  await page.goto("/app");
  await expect(page).toHaveURL(/login/);
});

test("mobile entry remains usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: "ابدأ بخصوصية" })).toBeVisible();
});

test("PWA metadata is installable", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  expect(manifest.dir).toBe("rtl");
  expect(manifest.display).toBe("standalone");
  expect(manifest.start_url).toBe("/app");
});
