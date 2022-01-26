import axios from "axios-https-proxy-fix";
import * as functions from "firebase-functions";
import { currentCoupon } from "./api";

export const PagoResponce = (db: FirebaseFirestore.Firestore) =>
  functions.https.onCall(async (data) => {
    const { email, to, amount, coupon } = data;

    const couponDiscount = await currentCoupon(db, coupon);
    /*   console.log(couponDiscount); */
    let sumWithDiscount = 0;
    couponDiscount !== undefined
      ? (sumWithDiscount = +(amount - +couponDiscount.gift).toFixed(2))
      : (sumWithDiscount = amount);

    const pago_config = {
      sandbox_url: "https://payment.123pago.net/msBotonDePago/index.jsp",
      /*    sandbox_url: "https://payment.123pago.net/ms_report2/login", */
      /*  provider_name: "UNALIVIO TEST", */
      provider_name: "UNALIVIO",
      api_key: "0e1543b5ec979737689339b63a17faf9",
      /*       api_key: "9bb4cde193775ec6f4cb8c4a724432a0", */
      btn_width: "190px",
    };

    const props = {
      nbproveedor: pago_config.provider_name,
      nb: "anonymous",
      ap: "test_123Pago",
      ci: "99888127",
      em: email,
      cs: pago_config.api_key,
      nai: `${Date.now()}`,
      co: "anonymous",
      mt: +sumWithDiscount,
      tl: to,
      width: pago_config.btn_width,
    };
    const responce = await axios({
      method: "post",
      url: pago_config.sandbox_url,
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      params: props,
    });
    console.log(responce);
    const result = {
      data: responce.data,
      id: responce.config.params.nai,
      sum: sumWithDiscount,
    };

    return result;
  });
