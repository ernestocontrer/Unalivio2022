
import {default as fetch, AxiosRequestConfig} from 'axios';

const urls = {
  cryptocompare: (fsym: string = 'usd', tsym: string = 'dash') => `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${fsym}&tsyms=${tsym}`,
  yadio: (fsym: string = 'usd') => `https://api.yadio.io/rate/${fsym}`,
  bitso: (fsym: string = 'btc', tsym: string = 'mxn') => `https://api.bitso.com/v3/ticker/?book=${fsym}_${tsym}`
}

const options = { 
  functions: {
    memory: "1GB" as "1GB",
    timeoutSeconds: 540
  },
  price: {
    yadio: (fsym: string = 'mxn', tsym: string = 'ves'): AxiosRequestConfig => ({
      url: urls.yadio(fsym),
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }),
    bitso: (fsym: string = 'btc', tsym: string = 'mxn'): AxiosRequestConfig => ({
      url: urls.bitso(fsym, tsym),
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }
};


 const main = async (
  db: FirebaseFirestore.Firestore
) => {


    const timestamp = new Date();
    
    console.log(`Starting fetchPrice at ${timestamp}.`);

    const btcmxn: number = +((await fetch(options.price.bitso('btc', 'mxn'))).data["payload"]["last"]);
    
    const btcves: number = +((await fetch(options.price.yadio('btc', 'ves'))).data["rate"]); 
            console.log('btcves',btcves ,btcmxn);
    console.log(`Inserting BTC/MXN rate ${btcmxn}`);
    await db.collection('rates').add({
      pair: db.doc('pairs/BTCMXN'),
      time: timestamp,
      price: btcmxn
    });

    console.log(`Inserting BTC/VES rate ${btcves}`);
    await db.collection('rates').add({
      pair: db.doc('pairs/BTCVES'),
      time: timestamp,
      price: btcves
    });
    
   const commission = 0.10 // biyuyo 6% 
    const referral = 0.02
    const utility = 0.05 
    const vesmxn =((btcves/btcmxn )*(1 - (commission + referral + utility) ));



    console.log(`Inserting VES/MXN rate ${vesmxn}`);
    await db.collection('rates').add({
      pair: db.doc('pairs/VESMXN'),
      time: timestamp,
      price: vesmxn
    });
    console.log('OK')

}

export default main;