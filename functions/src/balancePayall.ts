import * as functions from "firebase-functions";


const middlewareServerUrl = 'http://34.66.120.175:8080/getBalance';

async function postData(url: string, data: any) {
    const result = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
    });
    return await result.json();
}


// todo Move to Node JS
export const balancePayall = (db: FirebaseFirestore.Firestore) =>
    functions.https.onCall((data) => {
        try {

            let amounts: Array<number> = [];
            (await db.collection("amounts").get()).docs.map((collection) => {
                collection.data().data.map((elem: any) => {
                    amounts.push(elem.value);
                });
            });
            const maxAmount = amounts.sort((a, b) => b - a)[0];


            return (await postData(middlewareServerUrl, {maxAmount}));

        } catch (e) {
            console.error(e);
            return false
        }
    });
