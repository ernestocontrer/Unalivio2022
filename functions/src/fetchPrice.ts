import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {default as fetch, AxiosRequestConfig} from 'axios';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const options = { 
  functions: {
    memory: "2GB" as "2GB",
    timeoutSeconds: 540
  },
  price: (fsym: string = 'USD', tsym: string = 'DASH'): AxiosRequestConfig => ({
    url: `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsym}&tsyms=${tsym}`,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
};

const fetchPrice = async (base: string = 'USD', quote: string = 'DASH'): Promise<number> => {
  return ((await fetch(options.price(base, quote))).data[base][quote]);
}

export const main = functions
  .runWith(options.functions)
  .pubsub.schedule('every 15 minutes')
  .onRun(async (context: functions.EventContext) => {
    const timestamp = new Date();
    //const timestamp = Date.parse(datetime);
    console.log(`Starting fetchPrice at ${timestamp}.`);

    const usddash = await fetchPrice('USD', 'DASH');
    const dashmxn = await fetchPrice('DASH', 'MXN');
    const usdmxn = usddash * dashmxn;

    console.log(`Inserting USD/DASH rate ${usddash}`);
    await db.collection('rates').add({
      pair: db.doc('pairs/USDDASH'),
      time: timestamp,
      price: usddash
    });

    console.log(`Inserting DASH/MXN rate ${dashmxn}`);
    await db.collection('rates').add({
      pair: db.doc('pairs/DASHMXN'),
      time: timestamp,
      price: dashmxn
    });

    console.log(`Inserting computed USD/MXN rate ${usdmxn}`);
    return await db.collection('rates').add({
      pair: db.doc('pairs/USDMXN'),
      time: timestamp,
      price: usdmxn
    });
  });
