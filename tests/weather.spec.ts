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
I did it exacly like the documentation and it didn't work, I don't know why
*/
test("Mock API response and extract weather information", async ({ page, browserName }) => {
  const AAData = {
    lat: 9.03,
    lon: 38.74,
  };
  const API_key = 'cde8a5a5fd6f80091f9b9d12ecdf4c09';

  const { lat, lon } = AAData;

  await page.route(
    `/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`,
    async (route) => {
     const json = [{
      lat: 9.03,
      lon: 38.74,
      current: {
        temp: 37,
        weather: [{ main: "Rain" }]
      },
      timezone: "Africa/Addis_Ababa",
      name: "Addis Ababa"
    }]
    await route.fullfill({json})
    }
  );

  await page.goto("https://api.openweathermap.org");

  //change the weather to Rain and check if it is visible 
  await expect(page.getByText("humid")).toBeVisible();

  await page.screenshot({ path: "reports/Addis_Ababa_API.png" });

  if (browserName === 'chromium') {
    await page.emulateMedia({ media: 'screen' });
    await page.pdf({ path: 'reports/API.pdf' });
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


test('Extract weather information from OpenWeatherMap with dynamic content handling', async (browserName) => {
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

  if (browserName === 'chromium') {
    await page.emulateMedia({ media: 'screen' });
    await page.pdf({ path: 'reports/Addis_Ababa_Weather.pdf' });
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