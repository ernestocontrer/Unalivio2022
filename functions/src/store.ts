const store = require("store");

export const setData = (data: any) => {
  store.set("data", data);
};
export const getData = () => {
  return store.get("data");
};
