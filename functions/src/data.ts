export const currentRate = async (db: FirebaseFirestore.Firestore) => {
  const ratesQuery = await db
    .collection("rates")
    .where("pair", "==", db.doc("pairs/VESMXN"))
    .orderBy("time", "desc")
    .limit(1)
    .get();

  const rate = ratesQuery.docs[0]; //.data()
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
