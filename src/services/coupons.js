import { spawnDb } from "services/emulator-suite";

const coupons = (firebase) => {
  const db = spawnDb(firebase);
  const couponsRef = db.collection("coupons");
  return {
    list: () =>
      couponsRef.get().then((snap) =>
        snap.docs.map((doc) => ({
          name: doc.data().name,
          oneOff: doc.data().oneOff,
        })),
      ),
  };
};

export default coupons;
