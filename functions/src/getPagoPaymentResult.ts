import * as functions from "firebase-functions";
import { codePago } from "./statusCodes/pagoCodeResponce";
import sendmail from "./sendmail";
import { mailUnSuccess } from "./emails";
import {
	getTime,
	getRefCurrentOrder,
	addElemToOrdersWithProblems,
} from "./api";
import PayallRequest from "./soapApi";

export const pagoPaymentResponse = (db: FirebaseFirestore.Firestore) => {
	return functions.https.onRequest(async (req: any, res: any) => {
		const body = req.body;
		PayallRequest(db, {
			"options": {
				"data": {
					"to": "04144131804",
					"price": "12",
					"product": "1"
				}
			},
			"producto": "1"
		});
		const dataRef = await getRefCurrentOrder(db, body.nai);
		const checkOrder = async () => {
			setTimeout(() => {
				if (dataRef.size === 0) {
					checkOrder();
				} else {
					const options = {
						data: dataRef.docs[0].data(),
						time: getTime(),
						id: dataRef.docs[0].id,
					};

					PayallRequest(db, options);
				}
			}, 2500);
		};

		try {
			if (body.code === "00") {
				checkOrder();
				console.log(body);
			} else {
				const message = codePago[body.code];
				const options = {
					id: dataRef.docs[0].id,
					data: dataRef.docs[0].data(),
					message: body.message + message,
					code: "Pago",
				};
				await addElemToOrdersWithProblems(db, options);
				const emailOptions = {
					code: body.message,
					data: dataRef.docs[0].data(),
					time: getTime(),
					id: dataRef.docs[0].id,
				};
				await sendmail(mailUnSuccess(emailOptions), "mailUnSuccess");
				dataRef.forEach((doc) => {
					doc.ref.delete();
				});

				console.log("PAGO BAD CODE");
			}

			return res.json({ response: body });
		} catch (err) {
			console.error(err);
			const up = new functions.https.HttpsError(
				"internal",
				"Pago error:" + err.message,
			);
			throw up;
		}
	});
};
