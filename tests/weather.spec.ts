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
    await expect(page.getByText('Addis Ababa, ET')).toBeVisible();
  });
});

// test('Handle multiple browser contexts more efficiently', async () => {
//   const browser = await chromium.launch({ headless: false });

//   const context1 = await browser.newContext();
//   const context2 = await browser.newContext();

//   const page1 = await context1.newPage();
//   const page2 = await context2.newPage();

//   async function searchCity(page, cityName, fullCityName) {
//     await page.goto('https://weather.com', { timeout: 120000 });
//     const searchInput = await page.waitForSelector('[data-testid="searchModalInputBox"]', { timeout: 10000 });
//     await searchInput.fill(cityName);
//     await page.waitForSelector(`role=option[name='${fullCityName}']`, { timeout: 10000 });
//     await page.getByRole('option', { name: fullCityName }).click();
//     await page.waitForSelector(`text=${cityName}`, { timeout: 10000 });
//     const headerText = await page.locator('h1').textContent();
//     return headerText;
//   }

//   const [result1, result2] = await Promise.all([
//     searchCity(page1, 'Adama,Oromia,Ethiopia', 'Adama, Oromia, Ethiopia'),
//     searchCity(page2, 'Addis Ababa, Ethiopia', 'Addis Ababa, Ethiopia'),
//   ]);

//   expect(result1).toContain('Adama, Oromia, Ethiopia');
//   expect(result2).toContain('Addis Ababa, Ethiopia');

//   await browser.close();
// });


// // Interact with elements (click, type), Take Screenshot, Generate pdf
// test("Interact with elements", async ({ page }) => {
//   await page.goto("https://weather.com");

//   const searchInput = await page.waitForSelector('[data-testid="searchModalInputBox"]');
//   await searchInput.focus();
//   await page.keyboard.type("Addis Ababa", { delay: 100 }); 

//   await page.getByRole('option', { name: 'Addis Ababa, Ethiopia' }).click();

//   await page.waitForSelector("text=Addis Ababa");
//   await page.screenshot({ path: "reports/Addis_Ababa_Weather.png" });

//   await page.emulateMedia({ media: 'screen' });
//   await page.pdf({ path: 'reports/Addis_Ababa_Weather.pdf' });
// });


// //Mock API response and extract information
// test('Mock API response and extract weather information', async ({ page }) => {
//   await page.route('https://weather.com/api/v1/location/*', async (route) => {
//     const data = [{location: 'Addis Ababa', weather: 'Sunny', temperature:'37deg'}]
//     await route.fulfill({ data });
//   });

//   await page.goto('https://weather.com');

//   const searchInput = await page.waitForSelector('[data-testid="searchModalInputBox"]');
//   await searchInput.fill('Addis Ababa');
//   await page.getByRole('option', { name: 'Addis Ababa, Ethiopia' }).click();
//   await page.waitForSelector('text=Addis Ababa');

//   await expect(page.getByText('Sunny')).toBeVisible();

//   await page.screenshot({ path: 'reports/Addis_Ababa_Weather2.png' });
//   await page.emulateMedia({ media: 'screen' });
//   await page.pdf({ path: 'reports/Addis_Ababa_Weather2.pdf' });
// });


  
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

// // Implement waiting strategies and handling timeouts
// test('Implement advanced waiting strategies', async ({ page }) => {
//   test.slow();
//   await page.goto('https://weather.com', { timeout: 30000 });

//   const searchInput = await page.waitForSelector('[data-testid="searchModalInputBox"]', { timeout: 20000 });
//   await expect(searchInput).toBeVisible();

//   await searchInput.focus();
//   await page.keyboard.type('Addis Ababa', { delay: 100 });

//   const cityOption = await page.waitForSelector('text=Addis Ababa, Ethiopia', { timeout: 10000 });
//   await cityOption.click();

//   const cityTitle = await page.waitForSelector('text=Addis Ababa', { timeout: 10000 });
//   await expect(cityTitle).toBeVisible();

// });