import { spawnDb } from "services/emulator-suite";

const commision = (firebase) => {
  const db = spawnDb(firebase);
  const commision = db.collection("commision");
  return {
    getCommision: () =>
      commision.get().then((snap) =>
        snap.docs.map((doc) => ({
          commision: doc.data().commision,
        })),
      ),
  };
};

export default commision;
