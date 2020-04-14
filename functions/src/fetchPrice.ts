import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as cc from 'cryptocompare';

declare module NodeJS {
  interface Global {
    fetch: GlobalFetch
  }
}
global.fetch = require('node-fetch');

const options = { 
  functions: {
    memory: '2GB',
    timeoutSeconds: 540
  }
};

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

export const main = functions
  .runWith(options.functions)
  .pubsub.schedule('every 15 minutes')
  .onRun(async (context: functions.EventContext) => {
    const usddash = (await cc.price('USD', 'DASH'));
    const dashmxn = (await cc.price('DASH', 'MXN'));

    const time = Date.now();

    const successUSDDASH = await db.collection('rates').add({
      pair: db.doc('pairs/USDDASH'),
      time: time,
      price: usddash
    });

    const successDASHMXN = await db.collection('rates').add({
      pair: db.doc('pairs/DASHMXN'),
      time: time,
      price: dashmxn
    });

    if (successUSDDASH & successDASHMXN) {
      return await db.collection('rates').add({
        pair: db.doc('pairs/USDMXN'),
        time: time,
        price: usddash*dashmxn
      });
    }
    throw Error(`Rates not saved correctly at ${time}.`);
  });