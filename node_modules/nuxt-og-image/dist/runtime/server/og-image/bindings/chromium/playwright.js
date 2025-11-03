import playwright from "playwright";
export async function createBrowser() {
  return await playwright.chromium.launch({
    headless: true
  });
}
