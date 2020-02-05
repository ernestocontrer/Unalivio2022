import { defineFeature, loadFeature } from 'jest-cucumber';
import { Builder, /*ThenableWebDriver, WebElement,*/ By/*, WebElementPromise*/, until, ThenableWebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome'
//import firefox from 'selenium-webdriver/firefox'
import fetch from 'node-fetch';

const feature = loadFeature('./__tests__/features/1-13-rate.feature');
const SITE_URL = process.env.SITE_URL || 'http://localhost:8080';

defineFeature(feature, scenario => {
  let driver : ThenableWebDriver;
  
  beforeAll(async () => {
    driver = new Builder().
      forBrowser('chrome').
      setChromeOptions(new chrome.Options().headless()).
    //.setFirefoxOptions(new firefox.Options().headless())
      build();
  }, 10000);
 
  afterEach(async () => {
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
      await driver.get(SITE_URL);
    });
    
    then('she can check the conversion at the side.', async () => {
      const rate = (await (driver.wait(until.elementLocated(By.id('rate')), 10000)).getText())*1;
      expect(rate).toBeGreaterThan(0);
    });
  });
});