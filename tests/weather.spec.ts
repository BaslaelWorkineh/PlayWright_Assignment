const { test, expect } = require("@playwright/test");

test.describe("Weather Website Navigation", () => {
  test("Navigate to Weather.com", async ({ page }) => {
    await page.goto("https://weather.com");
    await expect(page).toHaveTitle(/Weather/);
  });
});

// test.describe("Weather Search Functionality", () => {
//   test("Search weather in a specific city", async ({ page }) => {
//     await page.goto("https://weather.com");
//     await page.fill('input[name="search"]', "New York");
//     await page.click('button[aria-label="Search"]');
//     await page.waitForSelector("text=New York, NY Weather");
//     await expect(page).toHaveText("New York, NY Weather");
//   });
// });

// test("Verify weather results", async ({ page }) => {
//   await page.goto("https://weather.com");
//   await page.fill('input[name="search"]', "New York");
//   await page.click('button[aria-label="Search"]');
//   await page.waitForSelector("text=New York, NY Weather");
//   const temperature = await page.textContent(
//     ".CurrentConditions--tempValue--3KcTQ"
//   );
//   expect(parseInt(temperature)).toBeGreaterThan(-50);
// });

// const { chromium } = require("playwright");

// test("Multiple browser contexts", async () => {
//   const browser = await chromium.launch();
//   const context1 = await browser.newContext();
//   const context2 = await browser.newContext();

//   const page1 = await context1.newPage();
//   await page1.goto("https://weather.com");
//   await page1.fill('input[name="search"]', "New York");
//   await page1.click('button[aria-label="Search"]');

//   const page2 = await context2.newPage();
//   await page2.goto("https://weather.com");
//   await page2.fill('input[name="search"]', "Los Angeles");
//   await page2.click('button[aria-label="Search"]');

//   await browser.close();
// });

// test("Interact with elements", async ({ page }) => {
//   await page.goto("https://weather.com");
//   await page.fill('input[name="search"]', "San Francisco");
//   await page.click('button[aria-label="Search"]');
//   await page.waitForSelector("text=San Francisco, CA Weather");
// });

// test("Take screenshot of results", async ({ page }) => {
//   await page.goto("https://weather.com");
//   await page.fill('input[name="search"]', "Chicago");
//   await page.click('button[aria-label="Search"]');
//   await page.waitForSelector("text=Chicago, IL Weather");
//   await page.screenshot({ path: "reports/chicago-weather.png" });
// });

// test('Mock API responses', async ({ page }) => {
//     await page.route('**/api/weather', route => {
//       route.fulfill({
//         contentType: 'application/json',
//         body: JSON.stringify({ temperature: '70°F', conditions: 'Sunny' }),
//       });
//     });
//     await page.goto('https://weather.com');
//     await page.fill('input[name="search"]', 'Miami');
//     await page.click('button[aria-label="Search"]');
//     const temperature = await page.textContent('.CurrentConditions--tempValue--3KcTQ');
//     expect(temperature).toBe('70°F');
//   });

  
// test("Extract weather information", async ({ page }) => {
//   await page.goto("https://weather.com");
//   await page.fill('input[name="search"]', "Seattle");
//   await page.click('button[aria-label="Search"]');
//   await page.waitForSelector("text=Seattle, WA Weather");
//   const temperature = await page.textContent(
//     ".CurrentConditions--tempValue--3KcTQ"
//   );
//   const conditions = await page.textContent(
//     ".CurrentConditions--phraseValue--2xXSr"
//   );
//   console.log(`Temperature: ${temperature}`);
//   console.log(`Conditions: ${conditions}`);
// });

// test("Handle dynamic content", async ({ page }) => {
//   await page.goto("https://weather.com");
//   await page.fill('input[name="search"]', "Boston");
//   await page.click('button[aria-label="Search"]');
//   await page.waitForTimeout(3000);
//   const weatherData = await page.$$eval(".someDynamicClass", (elements) => {
//     return elements.map((el) => el.textContent);
//   });
//   console.log(weatherData);
// });

// test("Implement waiting strategies", async ({ page }) => {
//   await page.goto("https://weather.com");
//   await page.fill('input[name="search"]', "Austin");
//   await page.click('button[aria-label="Search"]');
//   await page.waitForSelector("text=Austin, TX Weather", { timeout: 10000 });
// });
