import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as puppeteer from 'puppeteer';


admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

let options={ memory: '2GB', timeoutSeconds: 300, }


const findPrice = async () => {
    let url = 'https://www.bitrefill.com/buy/prepaid-digitel-mobile-top-up-venezuela/?hl=en'

    let browser = await puppeteer.launch({
        headless: true,
        args: [
          '--incognito',
          '--no-sandbox', 
          '--disable-setuid-sandbox'
        ]
    })
    let page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
            req.abort();
        }
        else {
            req.continue();
        }
    });
    await page.goto(url, { waitUntil: 'networkidle2' })


    // given im in https://www.bitrefill.com/buy/prepaid-digitel-mobile-top-up-venezuela/?hl=en
    / when i fill the 

    const data = await page.evaluate(() => {
        let currentPrice = document.querySelector('#priceblock_ourprice').innerText
        return currentPrice
    })
    await browser.close()
    return data
}


const formatPrice = (Price) => {

    var price = Price.replace(",", "")
    return price.substring(2, Price.length)
}

exports.main = functions.runWith(options).pubsub.schedule('every 15 minutes').onRun((context) => {
    return findPrice().then(res => {

        var currentPrice = formatPrice(res)
        console.log(Number(currentPrice))
        console.log(new Date().toLocaleTimeString())
        db.collection("test").add({ price: Number(currentPrice), time: Date.now() });

     
    })

});

