import { defineFeature, loadFeature } from 'jest-cucumber';
import { webdriver } from 'selenium-webdriver';

const driver = new webdriver.Builder().forBrowser("firefox").build();
const feature = loadFeature('./features/1-13-rate.feature');



const SITE_URL = process.env.SITE_URL;

defineFeature(feature, scenario => {
  scenario('Rate conversion at portal', ({ given, when, then }) => {
    given('that Bitrefill is online', async () => {
      let ok = false;
      const res = await fetch(
        'https://bitrefill.com', { 
          method: 'GET'
      });
      ok = res.ok && res.status == 200;
      if (!ok) throw Error('Bitrefill offline');
    });
    
    when('Ana visits the site', async () => {
      await driver.navigate().to(SITE_URL);
    });
    
    then('she can check the conversion at the side', () => {
      const rate = driver.findElement(By.id('rate'));
      expect(rate).toBeGreaterThan(0);
    });
  });
});