import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { pagoPaymentResponse } from "./getPagoPaymentResult";
import { PagoResponce as _PagoResponce } from "./pagoApi";
import { balancePayall as _balancePayall } from "./balancePayall";
/* import { main as _fetchPrice } from "./fetchPrice"; */
import { generate as _generateOrder } from "./orders";
import { sendExcel as _sendExcel } from "./sendExcel";
import { lifecycleCoupons as _lifecycleCoupons } from "./lifecycleCoupons";
import { validateCoupons as _validateCoupons } from "./validateCoupons";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

/* export const fetchPrice = _fetchPrice(db); */
export const generateOrder = _generateOrder(db);

export const getPagoPaymentResponse = pagoPaymentResponse(db);
export const exportExcel = _sendExcel(db);
export const pagoApi = _PagoResponce(db);
export const balanceUnalivio = _balancePayall(db);
export const lifecycleCoupons = _lifecycleCoupons(db);
export const validateCoupons = _validateCoupons(db);
