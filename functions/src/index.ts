import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { pagoPaymentResponse } from './getPagoPaymentResult';
import { main as _fetchPrice } from './fetchPrice';
import {
	generate as _generateOrder,
	notifyCreation as _notifyCreation,
	notifyUpdate as _notifyUpdate,
} from './orders';
// import requestPaso from './pagoAPI'

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

// export const requestPago = requestPaso()
export const fetchPrice = _fetchPrice(db);
export const generateOrder = _generateOrder(db);
export const notifyCreation = _notifyCreation();
export const notifyUpdate = _notifyUpdate(admin.firestore.FieldValue.delete());
export const getPagoPaymentResponse = pagoPaymentResponse(db);
