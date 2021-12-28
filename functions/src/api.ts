import * as moment from "moment-timezone";

export const addElemToOrder = async (
  db: FirebaseFirestore.Firestore,
  order: any,
) => {
  db.collection("orders")
    .doc(`${order.id}`)
    .set(order.data);
};

export const addElemToCurrentOrder = async (
  db: FirebaseFirestore.Firestore,
  order: any,
) => await db.collection("currentOrder").add(order);

export const getTime = () =>
  `${moment()
    .tz("America/Caracas")
    .format("DD/MM/YYYY")},${moment()
    .tz("America/Caracas")
    .format("LTS")}`;

export const getRefCurrentOrder = async (
  db: FirebaseFirestore.Firestore,
  id: string,
) =>
  await db
    .collection("currentOrder")
    .where("id", "==", id)
    .limit(1)
    .get();

export const addElemToOrdersWithProblems = async (
  db: FirebaseFirestore.Firestore,
  options: any,
) => {
  await db
    .collection("ordersWithProblems")
    .doc(`${options.id}`)
    .set({
      ...options.data,
      message: options.message,
      problemWith: options.code,
    });
};
export const getProducto = (product: any) => {
  let res;
  switch (product) {
    case "Movistar":
      res = "01";
      break;
    case "Movilnet":
      res = "61";
      break;
    case "Digitel":
      res = "14";
      break;
  }
  return res;
};
export const currentRate = async (db: FirebaseFirestore.Firestore) => {
  const ratesQuery = await db
    .collection("rates")
    .where("pair", "==", db.doc("pairs/VESMXN"))
    .orderBy("time", "desc")
    .limit(1)
    .get();

  const rate = ratesQuery.docs[0];
  return rate;
};

export const currentCoupon = async (
  db: FirebaseFirestore.Firestore,
  code: string,
) => {
  const couponsQuery = await db
    .collection("coupons")
    .where("name", "==", code)
    .limit(1)
    .get();

  const coupon: any = couponsQuery.empty
    ? undefined
    : couponsQuery.docs[0].data();
  return coupon;
};

export const validProducts = async (db: FirebaseFirestore.Firestore) =>
  (await db.collection("products").get()).docs.map((doc): string => doc.id);

export const validCoupons = async (db: FirebaseFirestore.Firestore) =>
  (await db.collection("coupons").get()).docs.map(
    (doc): string => doc.data().name,
  );
export const computePrice = (
  amount: number,
  rate: number,
  discount: any,
): number => {
  const discountValue = !discount ? 0 : +discount.gift;
  return Math.ceil((amount - discountValue + Number.EPSILON) * 100) / 100;
};
