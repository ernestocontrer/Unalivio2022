import * as functions from "firebase-functions";

import sendmail from "./sendmail";
import { mailPreOrder, mailUnSuccess } from "./emails";

import PayallRequest from "./soapApi";
import { validate } from "./orders/validate";
import { excelExport } from "./excelExport";
import {
  currentRate,
  currentCoupon,
  validCoupons,
  validProducts,
  computePrice,
} from "./data";

import * as moment from "moment-timezone";

export const getTime = () =>
  `${moment()
    .tz("America/Caracas")
    .format("DD/MM/YYYY")},${moment()
    .tz("America/Caracas")
    .format("LTS")}`;

export const generate = (db: FirebaseFirestore.Firestore) =>
  functions.https.onCall(async (order) => {
    const {
      id,
      product,
      amount,
      from,
      to,
      coupon,
      giveaway,
      productName,
      code,
      password,
    } = order;
    if (code === "ADMIN") {
      console.log(password);
      await excelExport(db, from);
      return;
    }

    console.log("Х12Й", order);
    if (!giveaway) {
      if (!product || !amount || !from || !to) {
        const up = new functions.https.HttpsError(
          "invalid-argument",
          "Por favor rellena todos los campos correctamente",
        );
        throw up;
      }
    } else if (!product || !from || !to) {
      const up = new functions.https.HttpsError(
        "invalid-argument",
        "Por favor rellena todos los campos correctamente",
      );
      throw up;
    }

    const rate = await currentRate(db);
    const products = await validProducts(db);
    const coupons = await validCoupons(db);
    console.log("QWE");
    try {
      await validate.email("from", from, "es");
      validate.phone("phone", to, "es");
      console.log("product", product, "es", products);
      validate.product("product", product, "es", products);

      if (giveaway) {
        validate.product("coupon", coupon, "es", coupons);
      }
    } catch (error) {
      const up = new functions.https.HttpsError(
        "invalid-argument",
        error.message,
      );
      throw up;
    }

    try {
      const coupon_ = await currentCoupon(db, coupon);

      const price = computePrice(amount, rate.data().price, coupon_).toString();

      console.log(price);
      const order_: any = {
        id: id,
        oneOff: coupon_ === undefined ? false : coupon_.oneOff,
        product: productName,
        from,
        to,
        price,
        created: getTime(),
        hasCoupon: coupon === "" ? false : true,
      };

      const order = await db.collection("currentOrder").add(order_);
      await sendmail(mailPreOrder(order_, order));
      return order_;
    } catch (err) {
      console.error(err);
      const up = new functions.https.HttpsError(
        "internal",
        "No pudimos procesar el pago:" + err.message,
      );
      throw up;
    }
  });
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
export const pagoPaymentResponse = (db: FirebaseFirestore.Firestore) => {
  return functions.https.onRequest(async (req: any, res: any) => {
    const body = req.body;
    const checkOrder = async () => {
      const dataRef = await db
        .collection("currentOrder")
        .where("id", "==", body.nai)
        .limit(1)
        .get();
      setTimeout(async () => {
        if (dataRef.size === 0) {
          checkOrder();
        } else {
          PayallRequest(
            db,
            dataRef.docs[0].data(),
            getTime(),
            dataRef.docs[0].id,
          );
        }
      }, 2500);
    };

    try {
      if (body.code === "00") {
        checkOrder();
        console.log(body);
      } else {
        const dataRef = await db
          .collection("currentOrder")
          .where("id", "==", body.nai)
          .limit(1)
          .get();
        await db
          .collection("ordersWithProblems")
          .doc(`${dataRef.docs[0].id}`)
          .set({
            ...dataRef.docs[0].data(),
            message: body.message,
            problemWith: "Pago",
          });
        await sendmail(
          mailUnSuccess(
            body.message,
            dataRef.docs[0].data(),
            getTime(),
            dataRef.docs[0].id,
          ),
        );
        console.log("PAGO BAD CODE");
      }

      return res.json({ response: body });
    } catch (err) {
      console.error(err);
      const up = new functions.https.HttpsError(
        "internal",
        "Pago error:" + err.message,
      );
      throw up;
    }
  });
};
