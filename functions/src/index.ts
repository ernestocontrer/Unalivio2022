import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import { pagoPaymentResponse } from "./getPagoPaymentResult";
/* import { main as _fetchPrice } from "./fetchPrice"; */
import { generate as _generateOrder } from "./orders";
import { sendExcel as _sendExcel } from "./sendExcel";

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

/* export const fetchPrice = _fetchPrice(db); */
export const generateOrder = _generateOrder(db);

export const getPagoPaymentResponse = pagoPaymentResponse(db);
export const exportExcel = _sendExcel(db);
