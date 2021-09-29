import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';

import {
  main as _fetchPrice
} from './fetchPrice'
import {
  generate as _generateOrder, 
  verify as _verifyOrder,
  notifyCreation as _notifyCreation,
  notifyUpdate as _notifyUpdate
} from './orders'


admin.initializeApp(functions.config().firebase);
const db = admin.firestore();


const config: Stripe.StripeConfig = {
  'apiVersion': '2020-03-02',
  'timeout': 10000
}

const stripe = new Stripe(functions.config().stripe.secret_key, config);

export const fetchPrice = _fetchPrice(db);
export const generateOrder = _generateOrder(db, stripe);
export const verifyOrder = _verifyOrder(db, stripe);
export const notifyCreation = _notifyCreation();
export const notifyUpdate = _notifyUpdate(admin.firestore.FieldValue.delete());
