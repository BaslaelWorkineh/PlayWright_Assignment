const { test, expect } = require("@playwright/test");
const { chromium } = require("playwright");

//Navigate, Search, Verify
test.describe('Weather search functionality', () => {
  test('Search weather in a specific city', async ({ page }) => {
    await page.goto('https://www.openweathermap.org/');

    const searchInput = await page.getByPlaceholder('Search city');
    await searchInput.fill('Addis Ababa');

    await page.getByRole('button', { name: 'Search' }).click();

    await page.waitForSelector('text=Addis Ababa');

    await page.locator('span').filter({ hasText: 'Addis Ababa, ET' }).getByRole('img').click()

    await expect(page.getByText('Addis Ababa, ET')).toBeVisible();
  });
});

//handling multiple browser
test('Handle multiple browser contexts', async () => {
  const browser = await chromium.launch({ headless: false });

  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  async function searchCity(page, cityName, fullCityName) {
    await page.goto('https://www.openweathermap.org/', { timeout: 120000 });
    const searchInput = await page.getByPlaceholder('Search city');
    await searchInput.fill(cityName);
    await page.getByRole('button', { name: 'Search' }).click();

    await page.waitForSelector(`text=${cityName}`);

    await page.locator('span').filter({ hasText: `${cityName}, ET` }).getByRole('img').click()

    const headerText = await page.getByRole('heading', { name: `${cityName}, ET` }).textContent();
    return headerText;
  }

  const [result1, result2] = await Promise.all([
    searchCity(page1, 'Adama', 'Adama, Ethiopia'),
    searchCity(page2, 'Addis Ababa', 'Addis Ababa, Ethiopia'),
  ]);

  expect(result1).toContain('Adama, ET');
  expect(result2).toContain('Addis Ababa, ET');

  await browser.close();
});

//Interact with elements (click, type), Take Screenshot, Generate pdf
//Remember pdf doesn't work on firefox and webkit
test("Interact with elements", async ({ page, browserName }) => {
  await page.goto("https://www.openweathermap.org/");

  const searchInput = await page.getByPlaceholder('Search city');
  await searchInput.focus();
  await page.keyboard.type("Addis Ababa", { delay: 100 });

  await page.click('button[type="submit"]');

  await page.waitForSelector('text=Addis Ababa');
  await page.locator('span').filter({ hasText: 'Addis Ababa, ET' }).getByRole('img').click();

  await page.screenshot({ path: "reports/Addis_Ababa_Weather.png" });

  // pdf only works on chromium
  if (browserName === 'chromium') {
    await page.emulateMedia({ media: 'screen' });
    await page.pdf({ path: 'reports/Addis_Ababa_Weather.pdf' });
  }
});

/*Mock API response and extract weather information

this is the result I got

{"cod":401, "message": "Please note that using One Call 3.0 requires 
a separate subscription to the One Call by Call plan. 
Learn more here https://openweathermap.org/price. If you have a valid subscription to the One Call by Call plan, but still receive this error, then please see 
https://openweathermap.org/faq#error401 for more info."}
*/

test("Mock API response and extract weather information", async ({ page, browserName }) => {
  const mockApiResponse = {
    lat: 9.03,
    lon: 38.74,
    current: {
      temp: 310.15,
      weather: [{ description: "Sunny" }]
    },
    timezone: "Africa/Addis_Ababa",
    name: "Addis Ababa"
  };

  await page.route(
    "https://api.openweathermap.org/data/3.0/onecall*",
    async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(mockApiResponse),
      });
    }
  );

  await page.goto("https://www.openweathermap.org");

  const searchInput = await page.getByPlaceholder("Search city");
  await searchInput.fill("Addis Ababa");
  await page.getByRole("button", { name: "Search" }).click();

  const dropdownOption = await page.waitForSelector('span:has-text("Addis Ababa, ET")', { timeout: 15000 });
  await dropdownOption.click();

  //the api needs subscription to use it but i used their documentation
  await page.waitForSelector("text=Sunny", { timeout: 10000 });
  await expect(page.getByText("Sunny")).toBeVisible();

  await page.screenshot({ path: "reports/Addis_Ababa_Weather2.png" });

  if (browserName === 'chromium') {
    await page.emulateMedia({ media: 'screen' });
    await page.pdf({ path: 'reports/Addis_Ababa_Weather.pdf' });
  }
});

//Extract weather information from the site and show it on terminal
test('Extract weather information', async () => {

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.openweathermap.org');

  const searchInput = await page.getByPlaceholder('Search city');
  await searchInput.fill('Addis Ababa');
  await page.getByRole('button', { name: 'Search' }).click();

  await page.waitForSelector('text=Addis Ababa, ET');

  await page.locator('span', { hasText: 'Addis Ababa, ET' }).click();

  await page.waitForSelector('.current-temp');

  const temperature = await page.locator('.current-temp').textContent();

  console.log('Weather Information for Addis Ababa:');
  console.log(`Temperature: ${temperature}`);

  await browser.close();
});


test('Extract weather information from OpenWeatherMap with dynamic content handling', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.openweathermap.org');

  const searchInput = await page.getByPlaceholder('Search city');
  await searchInput.fill('Addis Ababa');
  await page.getByRole('button', { name: 'Search' }).click();

  const dropdownOption = await page.waitForSelector('span:has-text("Addis Ababa, ET")', { timeout: 20000 });
  await dropdownOption.click();

  await page.waitForLoadState('networkidle');

  let temperature;
  for (let i = 0; i < 3; i++) {
    try {
      temperature = await page.locator('.current-temp').textContent({ timeout: 5000 });
      if (temperature) break;
    } catch (error) {
      if (i === 2) throw new Error('Failed to extract weather information after 3 attempts');
    }
  }

  console.log('Weather Information for Addis Ababa:');
  console.log(`Temperature: ${temperature}`);

  await page.screenshot({ path: "reports/Addis_Ababa_Weather.png" });

  if (page.context().browserName() === 'chromium') {
    await page.emulateMedia({ media: "screen" });
    await page.pdf({ path: "reports/Addis_Ababa_Weather2.pdf" });
  }

  await browser.close();
});

//Implement waiting strategies and handling timeouts
test('Implement waiting strategies and handle timeouts', async ({ page }) => {
  await page.goto('https://www.openweathermap.org');

  const searchInput = await page.getByPlaceholder('Search city', { timeout: 10000 });
  await searchInput.fill('Addis Ababa');

  const searchButton = await page.waitForSelector('button[type="submit"]', { timeout: 5000 });
  await searchButton.click();

  await page.locator('span').filter({ hasText: 'Addis Ababa, ET' }).getByRole('img').click()

  try {
    await page.waitForSelector('.orange-text', { timeout: 15000 });
  } catch (error) {
    console.error('Timeout waiting for weather details to appear:', error);
    throw error;
  }
});