import * as functions from "firebase-functions";
import PayallRequest from "./soapApi";

export const pagoPaymentResponse = (db: FirebaseFirestore.Firestore) => {
  return functions.https.onRequest((req: any, res: any) => {
    const body = req.body;

    try {
      switch (body.code) {
        case "00":
          PayallRequest();
          break;
        default:
          console.log("PAGO BAD CODE");
          break;
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
