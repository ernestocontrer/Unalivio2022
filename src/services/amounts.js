import { spawnDb } from "services/emulator-suite";

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
