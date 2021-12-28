import { spawnApi } from "services/emulator-suite";
const calls = {
  create: "sendExcel",
};

const sendExcel = (firebase) => {
  const api = spawnApi(firebase);
  return {
    create: (order) => api.httpsCallable(calls.create)(order),
  };
};

export default sendExcel;
