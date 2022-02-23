import * as functions from "firebase-functions";
import axios from "axios-https-proxy-fix";

export const balancePayall = (db: FirebaseFirestore.Firestore) =>
  functions.https.onCall(async (data) => {
    const res = await axios.post("34.66.120.175 ", {
      msg: "Hello node server",
    });
    // console.log(data);
    // /*     const soap = require("soap-as-promised"); */
    // const soap = require("soap");
    // const url = "http://164.52.144.203:9967/payall/ws?wsdl";
    // const args = {
    //   arg0: {
    //     pv: "4348", //idPV
    //     pin: "81264062", //pin
    //     key: "HOcpMcgEDA4FEYX", //IMEI22
    //     code: "####", //mac
    //   },
    // };
    // let amounts: Array<number> = [];

    // (await db.collection("amounts").get()).docs.map((collection) => {
    //   collection.data().data.map((elem: any) => {
    //     amounts.push(elem.value);
    //   });
    // });
    // const maxAmount = amounts.sort((a, b) => b - a)[0];
    // const payallPromise = new Promise((resolve, reject) => {
    //   soap.createClient(url, (err: any, client: any) => {
    //     client.saldo(args, (err: any, responce: any) => {
    //       console.log(responce.return.saldo_disponible);
    //       return resolve(!(maxAmount * 5 >= responce.return.saldo_disponible));
    //     });
    //   });
    // });
    // const res = await payallPromise;
    return res;
  });
