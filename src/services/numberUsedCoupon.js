import { spawnDb } from "services/emulator-suite";

const numberUsedCoupon = (firebase) => {
  const db = spawnDb(firebase);
  const numberRef = db.collection("numberUsedCoupon");
  return {
    list: () =>
      numberRef.get().then((snap) =>
        snap.docs.map((doc) => ({
          number: doc.data().number,
        })),
      ),
  };
};

export default numberUsedCoupon;
