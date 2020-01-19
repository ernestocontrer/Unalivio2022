import { defineFeature, loadFeature } from 'jest-cucumber';
import { Builder, /*ThenableWebDriver, WebElement,*/ By/*, WebElementPromise*/ } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome'
import firefox from 'selenium-webdriver/firefox'
import fetch from 'node-fetch';

const feature = loadFeature('./features/1-13-rate.feature');
const SITE_URL = process.env.SITE_URL || 'http://localhost:8080';

defineFeature(feature, scenario => {
  let driver;
  
  beforeAll(async () => {
    driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options())
    .setFirefoxOptions(new firefox.Options())
    .build();
  }, 10000);
 
  afterAll(async () => {
    await driver.quit();
  }, 30000);
 
  scenario('Rate conversion at portal', ({ given, when, then }) => {
    given('that Bitrefill is online,', async () => {
      let ok = false;
      const res = await fetch(
        'https://bitrefill.com', { 
          method: 'GET'
      });
      ok = res.ok && res.status == 200;

      if (!ok) throw Error('Bitrefill offline');
    });
    
    when('Ana visits the site,', async () => {
      await driver.navigate().to(SITE_URL);
    });
    
    then('she can check the conversion at the side.', () => {
      const rate = driver.findElement(By.id('rate'));
      expect(rate).toBeGreaterThan(0);
    });
  });
});