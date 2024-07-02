const { test, expect } = require("@playwright/test");
const { chromium } = require("playwright");

// //Navigate, Search, Verify
// test.describe('Weather search functionality', () => {
//   test('Search weather in a specific city', async ({ page }) => {
//     await page.goto('https://www.openweathermap.org/');

//     const searchInput = await page.getByPlaceholder('Search city');
//     await searchInput.fill('Addis Ababa');

//     await page.getByRole('button', { name: 'Search' }).click();

//     await page.waitForSelector('text=Addis Ababa');

//     await page.locator('span').filter({ hasText: 'Addis Ababa, ET' }).getByRole('img').click()

//     await expect(page.getByText('Addis Ababa, ET')).toBeVisible();
//   });
// });

// //handling multiple browser
// test('Handle multiple browser contexts', async () => {
//   const browser = await chromium.launch({ headless: false });

//   const context1 = await browser.newContext();
//   const context2 = await browser.newContext();

//   const page1 = await context1.newPage();
//   const page2 = await context2.newPage();

//   async function searchCity(page, cityName, fullCityName) {
//     await page.goto('https://www.openweathermap.org/', { timeout: 120000 });
//     const searchInput = await page.getByPlaceholder('Search city');
//     await searchInput.fill(cityName);
//     await page.getByRole('button', { name: 'Search' }).click();

//     await page.waitForSelector(`text=${cityName}`);

//     await page.locator('span').filter({ hasText: `${cityName}, ET` }).getByRole('img').click()

//     const headerText = await page.getByRole('heading', { name: `${cityName}, ET` }).textContent();
//     return headerText;
//   }

//   const [result1, result2] = await Promise.all([
//     searchCity(page1, 'Adama', 'Adama, Ethiopia'),
//     searchCity(page2, 'Addis Ababa', 'Addis Ababa, Ethiopia'),
//   ]);

//   expect(result1).toContain('Adama, ET');
//   expect(result2).toContain('Addis Ababa, ET');

//   await browser.close();
// });

// //Interact with elements (click, type), Take Screenshot, Generate pdf
// //Remember pdf doesn't work on firefox and webkit
// test("Interact with elements", async ({ page, browserName }) => {
//   await page.goto("https://www.openweathermap.org/");

//   const searchInput = await page.getByPlaceholder('Search city');
//   await searchInput.focus();
//   await page.keyboard.type("Addis Ababa", { delay: 100 });

//   await page.click('button[type="submit"]');

//   await page.waitForSelector('text=Addis Ababa');
//   await page.locator('span').filter({ hasText: 'Addis Ababa, ET' }).getByRole('img').click();

//   await page.screenshot({ path: "reports/Addis_Ababa_Weather.png" });

//   // pdf only works on chromium
//   if (browserName === 'chromium') {
//     await page.emulateMedia({ media: 'screen' });
//     await page.pdf({ path: 'reports/Addis_Ababa_Weather.pdf' });
//   }
// });

/*Mock API response and extract weather information
*/
test("Mock API response and extract weather information", async ({ page }) => {
  const mockApiResponse = {
    coord: { lon: 38.74, lat: 9.03 },
    weather: [{ id: 500, main: "Rain", description: "light rain", icon: "10n" }],
    base: "stations",
    main: {
      temp: 289.46,
      feels_like: 289.16,
      temp_min: 289.46,
      temp_max: 289.46,
      pressure: 1016,
      humidity: 77,
      sea_level: 1016,
      grnd_level: 768
    },
    visibility: 10000,
    wind: { speed: 2.06, deg: 230 },
    rain: { "1h": 0.84 },
    clouds: { all: 75 },
    dt: 1719940605,
    sys: {
      type: 1,
      id: 2453,
      country: "ET",
      sunrise: 1719889789,
      sunset: 1719935287
    },
    timezone: 10800,
    id: 344979,
    name: "Addis Ababa",
    cod: 200
  };

  // Mock the API response before navigating
  await page.route("**/data/2.5/weather*", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockApiResponse),
    });
  });

  // Navigate to the base URL
  await page.goto("https://api.openweathermap.org");

  // Perform interactions as needed
  const searchInput = await page.getByPlaceholder("Search city");
  await searchInput.fill("Addis Ababa");
  await page.getByRole("button", { name: "Search" }).click();

  // Wait for the weather information to be visible
  await page.waitForSelector("text=light rain", { timeout: 10000 });
  await expect(page.getByText("light rain")).toBeVisible();

  // Take a screenshot
  await page.screenshot({ path: "reports/Addis_Ababa_Weather.png" });
});


// //Extract weather information from the site and show it on terminal
// test('Extract weather information', async () => {

//   const browser = await chromium.launch({ headless: true });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   await page.goto('https://www.openweathermap.org');

//   const searchInput = await page.getByPlaceholder('Search city');
//   await searchInput.fill('Addis Ababa');
//   await page.getByRole('button', { name: 'Search' }).click();

//   await page.waitForSelector('text=Addis Ababa, ET');

//   await page.locator('span', { hasText: 'Addis Ababa, ET' }).click();

//   await page.waitForSelector('.current-temp');

//   const temperature = await page.locator('.current-temp').textContent();

//   console.log('Weather Information for Addis Ababa:');
//   console.log(`Temperature: ${temperature}`);

//   await browser.close();
// });


// test('Extract weather information from OpenWeatherMap with dynamic content handling', async (browserName) => {
//   const browser = await chromium.launch({ headless: false });
//   const context = await browser.newContext();
//   const page = await context.newPage();

//   await page.goto('https://www.openweathermap.org');

//   const searchInput = await page.getByPlaceholder('Search city');
//   await searchInput.fill('Addis Ababa');
//   await page.getByRole('button', { name: 'Search' }).click();

//   const dropdownOption = await page.waitForSelector('span:has-text("Addis Ababa, ET")', { timeout: 20000 });
//   await dropdownOption.click();

//   await page.waitForLoadState('networkidle');

//   let temperature;
//   for (let i = 0; i < 3; i++) {
//     try {
//       temperature = await page.locator('.current-temp').textContent({ timeout: 5000 });
//       if (temperature) break;
//     } catch (error) {
//       if (i === 2) throw new Error('Failed to extract weather information after 3 attempts');
//     }
//   }

//   console.log('Weather Information for Addis Ababa:');
//   console.log(`Temperature: ${temperature}`);

//   await page.screenshot({ path: "reports/Addis_Ababa_Weather.png" });

//   if (browserName === 'chromium') {
//     await page.emulateMedia({ media: 'screen' });
//     await page.pdf({ path: 'reports/Addis_Ababa_Weather.pdf' });
//   }

//   await browser.close();
// });

// //Implement waiting strategies and handling timeouts
// test('Implement waiting strategies and handle timeouts', async ({ page }) => {
//   await page.goto('https://www.openweathermap.org');

//   const searchInput = await page.getByPlaceholder('Search city', { timeout: 10000 });
//   await searchInput.fill('Addis Ababa');

//   const searchButton = await page.waitForSelector('button[type="submit"]', { timeout: 5000 });
//   await searchButton.click();

//   await page.locator('span').filter({ hasText: 'Addis Ababa, ET' }).getByRole('img').click()

//   try {
//     await page.waitForSelector('.orange-text', { timeout: 15000 });
//   } catch (error) {
//     console.error('Timeout waiting for weather details to appear:', error);
//     throw error;
//   }
// });