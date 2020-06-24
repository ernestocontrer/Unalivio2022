import * as functions from 'firebase-functions';
import {default as fetch, AxiosRequestConfig} from 'axios';

const urls = {
  cryptocompare: (fsym: string = 'USD', tsym: string = 'DASH') => `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsym}&tsyms=${tsym}`,
  yadio: (tsym: string = 'MXN') => `https://api.yadio.io/rate/${tsym}`,
}

const options = { 
  functions: {
    memory: "2GB" as "2GB",
    timeoutSeconds: 540
  },
  price: (tsym: string = 'MXN'): AxiosRequestConfig => ({
    url: urls.yadio(tsym),
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
};

const fetchPrice = async (quote: string = 'MXN'): Promise<number> => {
  return ((await fetch(options.price(quote))).data["rate"]);
}

export const main = (
  db: FirebaseFirestore.Firestore
) => functions
  .runWith(options.functions)
  .pubsub.schedule('every 15 minutes')
  .onRun(async (context: functions.EventContext) => {
    const timestamp = new Date();
    //const timestamp = Date.parse(datetime);
    console.log(`Starting fetchPrice at ${timestamp}.`);

    const vesmxn = await fetchPrice('MXN');

    console.log(`Inserting VES/MXN rate ${vesmxn}`);
    await db.collection('rates').add({
      pair: db.doc('pairs/VESMXN'),
      time: timestamp,
      price: vesmxn
    });
  });
