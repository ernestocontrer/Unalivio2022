import * as functions from "firebase-functions";

import sendmail from "./sendmail";
import { mailPreOrder /* mailSuccess, mailUnSuccess */ } from "./emails";
import { addElemToCurrentOrder, getTime } from "./api";
import { validate } from "./orders/validate";

import {
  currentRate,
  currentCoupon,
  validCoupons,
  validProducts,
  computePrice,
} from "./api";
/* import PayallRequest from "./soapApi"; */

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
    } = order;

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

      const order = await addElemToCurrentOrder(db, order_);
      console.log(order.id);
      const option = {
        data: order_,
        id: order.id,
        time: getTime(),
      };
      /* const emailOptions = {
        data: order_,
        time: getTime(),
        timePagoResponce: getTime(),
        id: order.id,
      }; */
      await sendmail(mailPreOrder(option), "preorder");
      /*    await sendmail(mailSuccess(emailOptions), "mailSuccess");
      await sendmail(mailUnSuccess(option), "mailUnSuccess"); */

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
