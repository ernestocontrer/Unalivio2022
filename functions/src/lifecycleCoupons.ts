import * as functions from "firebase-functions";
export const lifecycleCoupons = (db: FirebaseFirestore.Firestore) =>
  functions.pubsub
    .schedule("every day 23:59")
    .timeZone("America/Caracas")
    .onRun(async (context: functions.EventContext) => {
      const couponsRef = await db.collection("coupons").get();

      const deleteCoupon = (data: any) => {
        console.log(data.name);
        const coupons_query = db
          .collection("coupons")
          .where("name", "==", data.name);
        coupons_query.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
      };

      couponsRef.docs.map((doc) => {
        const data = doc.data();
        if (Date.now() / 1000 + 120 > data.date._seconds) deleteCoupon(data);
      });
    });
