import { spawnDb } from "services/emulator-suite";

const rates = (firebase) => {
  const db = spawnDb(firebase);
  const ratesRef = db.collection("rates");
  console.log(
    "kek",
    ratesRef
      .where("pair", "==", db.doc("pairs/VESMXN"))
      .orderBy("time", "desc")
      .limit(2)
      .get()
      .then((snap) => {
        snap.docs.map((elem) => {
          console.log("PUTA", elem.data());
        });
      }),
  );
  return {
    list: () =>
      ratesRef.get().then((snap) =>
        snap.map((rate) => ({
          name: rate.data().price,
          value: rate.id,
        })),
      ),
    last: () =>
      ratesRef
        .where("pair", "==", db.doc("pairs/VESMXN"))
        .orderBy("time", "desc")
        .limit(1)
        .get(),
  };
};

export default rates;
