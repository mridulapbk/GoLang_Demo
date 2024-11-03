const { chromium } = require('playwright');

async function applyToAccenture() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
   
    console.log("Navigating to Accenture careers page...");
    await page.goto('https://www.accenture.com/us-en/careers/jobsearch');

    
    const cookieBanner = await page.$('text=Cookies Settings');
    if (cookieBanner) {
      console.log("Clicking Cookies Settings...");
      await page.click('text=Cookies Settings');
    }

    
    console.log("Waiting for the job search input field...");
    await page.waitForSelector('input[placeholder="Find your next opportunity"]', { timeout: 20000 });

    
    console.log("Filling the search box with 'Software Engineer'...");
    await page.fill('input[placeholder="Find your next opportunity"]', 'Software Engineer');

    
    console.log("Pressing Enter to search for jobs...");
    await page.keyboard.press('Enter');

    
    console.log("Waiting for job results to load...");
    await page.waitForSelector('.job-results__list', { timeout: 30000 });

    
    console.log("Clicking the 'Software Engineer' job listing...");
    await page.click('text=Software Engineer'); // Clicks the job listing with the exact text 'Software Engineer'

    
    console.log("Waiting for the job description page...");
    await page.waitForSelector('h1.job-details__title', { timeout: 15000 });

    console.log("Clicking the 'Apply' button...");
    await page.click('button#apply-button');

    
    console.log("Waiting for the application form...");
    await page.waitForSelector('input[name="firstName"]', { timeout: 15000 });

    
    console.log("Filling out the application form...");
    await page.fill('input[name="firstName"]', 'John');
    await page.fill('input[name="lastName"]', 'Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="phoneNumber"]', '1234567890');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="state"]', 'NY');

    // Upload resume
    console.log("Uploading resume...");
    await page.setInputFiles('input[type="file"]', '/path/to/resume.pdf');

    // Accept terms
    console.log("Accepting terms and conditions...");
    await page.check('input[name="acceptTerms"]');

    console.log("Form filled successfully!");

    
    await page.waitForTimeout(10000);

  } catch (error) {
    console.error("An error occurred:", error);
    await page.screenshot({ path: 'error_screenshot.png' });
    console.log("Screenshot saved as error_screenshot.png");
  } finally {
    await browser.close();
  }
}

(async () => {
  await applyToAccenture();
})();
