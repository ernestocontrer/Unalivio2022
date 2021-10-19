import * as functions from "firebase-functions";

export const pagoPaymentResponse = (db: FirebaseFirestore.Firestore) => {
    return functions.https.onRequest((req, res) => {
        const body = req.body;

        try {
            console.log({body});

            return res.json({response: body});
        } catch (err) {
            console.error(err);
            const up = new functions.https.HttpsError(
                'internal',
                'Pago error:' + err.message
            );
            throw up;
        }
    })
}

