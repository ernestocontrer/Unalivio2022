import * as functions from "firebase-functions";

export const validateCoupons = (db: FirebaseFirestore.Firestore) =>
  functions.https.onCall(async (data) => {
    const { couponsCode } = data;
    const couponsRef = await db.collection("coupons").get();
    const couponsNameList = couponsRef.docs.map((elem) => {
      return elem.data().name;
    });
    if (couponsNameList.includes(couponsCode)) return true;

    return false;
  });
