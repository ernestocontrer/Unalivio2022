import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as pptr from 'puppeteer';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const options = { 
  functions: {
    memory: '2GB',
    timeoutSeconds: 540
  } as functions.RuntimeOptions,
  browser: {
    headless: true,
    args: [
      '--incognito',
      '--sandbox', 
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080',
      //'--disable-setuid-sandbox'
    ]
  }
};

const selectors = {
  form: {
    url: 'https://www.bitrefill.com/buy/prepaid-digitel-mobile-top-up-venezuela/?hl=en',
    amount: 'input[type="number"][name="ranged_value"]',
    phone: 'input[type="tel"][name="recipient"]',
    purchase: 'button[type="submit"][data-amp-bind-disabled="loading"]',
    checkout: 'a[href="/checkout"]'
  },
  checkout: {
    url: 'https://www.bitrefill.com/checkout',
    email: 'input[type="email"][name="email"][autocomplete="email"]',
    continue: 'button[type="submit"]',
    payment: 'button[name="payment_method"][value="dash"]'
  },
  order: {
    dash: ''
  }
}


const findQuote = async () => {
  const browser = await pptr.launch(options.browser);
  const page = (await browser.pages())[0];
  //await page.setViewport({ width: 1920, height: 1080 });
  await page.setRequestInterception(true);
  page.on('request', async (req) => {
    if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
      await req.abort();
    }
    else {
      await req.continue();
    }
  });

  console.log('Visiting form url')
  await page.goto(selectors.form.url, { waitUntil: 'networkidle2' });

  // fill minimum decimal value amount
  console.log('Filling form amount')
  await page.waitForSelector(selectors.form.amount);
  await page.$eval(selectors.form.amount, el => 
    el.setAttribute('value', '10000')
  );

  // insert fake num
  console.log('Filling form phone')
  await page.waitForSelector(selectors.form.checkout);
  await page.$eval(selectors.form.phone, el => 
    el.setAttribute('value', '04121234567')
  );
  
  // cloick purchase
  console.log('Clicking purchase')
  //await page.waitForSelector(selectors.form.purchase);
  //await page.click(selectors.form.purchase);
  await page.$eval('#form', (form: any) => {
    form.submit();
  });
  await page.waitForNavigation({waitUntil: 'networkidle2'});

  // click checkout
  console.log('Going to checkout')
  await page.waitForSelector(selectors.form.checkout);
  await page.goto(selectors.checkout.url, {
    // wait until ready
    waitUntil: 'networkidle2', 
    referer: selectors.form.url
  });

  // select email
  console.log('Filling checkout email')
  await page.waitForSelector(selectors.checkout.email);
  await page.type(selectors.checkout.email, 'a@b.com');
  

  // click continue
  console.log('Clicking continue')
  await page.waitForSelector(selectors.checkout.continue);
  await page.type(selectors.checkout.continue, '\n');

  // select dash payment method
  console.log('Clicking payment')
  await page.waitForSelector(selectors.checkout.payment);
  await page.click(selectors.checkout.payment);

  // wait till order detail page is ready
  console.log('Going to order detail')
  await page.waitForNavigation({waitUntil: 'networkidle2'});
  // await page.reload({
  //   waitUntil: 'networkidle2',
  //   timeout: 3000000
  // })

  // select quote value
  console.log('Fetching quote value');
  let quote: string;
 
  quote = await page.evaluate(async () => {
    const quoteScraper = () => {
      return new Promise(function(resolve, reject) {
        setTimeout(function() {
          const spans = Array.from(document.querySelectorAll('span'), e => e.innerHTML);
          const span = spans.filter(x => /(.*) DASH/.exec(x))[0]
          const value = span.slice(0, -5);
          resolve(value);
        }, 3000);
      });
    }
    return Promise.resolve(await quoteScraper());
  }) as string;
  if (!quote) 
    throw Error("No quote found!");

  console.log('Closing browser')
  await browser.close();
  return quote;
}


export const main = functions
  .runWith(options.functions)
  .pubsub.schedule('every 15 minutes')
  .onRun(async (context: functions.EventContext) => {
    const quote = await findQuote();
    const currentPrice = Number(10000/parseFloat(quote));

    return await db.collection('rates').add({
      pair: db.doc('pairs/VESDASH'),
      time: Date.now(),
      price: currentPrice
    });
  });

