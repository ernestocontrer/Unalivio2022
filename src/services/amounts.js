/* import { spawnDb } from "services/emulator-suite";

const calls = {
  list: "amounts-list",
};

const amounts = (firebase) => {
  const db = spawnDb(firebase);
  const amountsRef = db.collection("amounts");
  return {
    list: () =>
      amountsRef.get().then((snap) =>
        snap.docs.map((doc) => ({
          name: doc.data().name,
          value: doc.data().value,
          commision: doc.data().commision,
        })),
      ),
  };
};

export default amounts;
 */
import { spawnDb } from "services/emulator-suite";

const amounts = (firebase) => {
  const db = spawnDb(firebase);
  const amountRef = db.collection("amounts");
  const nameProduct = ["Digitel", "Movilnet", "Movistar"];
  return {
    list: () =>
      amountRef.get().then((snap) =>
        snap.docs.map((doc, index) => {
          return {
            data: doc.data(),
            name: nameProduct[index],
          };
        }),
      ),
  };
};

export default amounts;
