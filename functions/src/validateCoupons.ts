import * as functions from "firebase-functions";

export const validateCoupons = (db: FirebaseFirestore.Firestore) =>
	functions.https.onCall(async (data) => {
		const { couponsCode, phone } = data;
		const couponsRef = await db.collection("coupons").get();
		const numberUsedCouponsRef = await db.collection("numberUsedCoupon").get();

		const numberUsedCouponsList = numberUsedCouponsRef.docs.map(
			(el) => el.data().number,
		);
		const couponsNameList = couponsRef.docs.filter((elem) => {
			const coupon = elem.data();
			if (coupon.oneOff) return coupon.name;
		});
		if (
			couponsNameList.includes(couponsCode) &&
			numberUsedCouponsList.includes(phone)
		)
			return false;

		return true;
	});
