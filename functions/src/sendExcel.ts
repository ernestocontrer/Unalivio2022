import * as functions from "firebase-functions";
import sendmail from "./sendmail";
import { maileExcel } from "./emails";
import * as moment from "moment-timezone";

export const sendExcel = (db: FirebaseFirestore.Firestore) =>
  functions.https.onCall(async (data) => {
    const { email, password } = data;
    const validateCredentional = async () => {
      const data = (await db.collection("admin").get()).docs[0].data();
      if (!(data.email === email && data.password === password)) return false;

      return true;
    };
    if (!(await validateCredentional())) return false;

    const Excel = require("exceljs");
    const filename = "orders.xlsx";
    const getOrders = async (collection: string) => {
      return (await db.collection(collection).get()).docs.map((doc): any => {
        const data = doc.data();
        const time =
          typeof data.created === "object"
            ? moment.unix(data.created._seconds).format("MM/DD/YYYY")
            : data.created;

        return {
          price: data.price,
          to: data.to,
          from: data.from,
          created: time,
          success: collection === "orders" ? "Yes" : "No",
        };
      });
    };
    const ordersSuccess = await getOrders("orders");
    const ordersUnSuccess = await getOrders("ordersWithProblems");
    const order = [...ordersSuccess, ...ordersUnSuccess];
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet("Orders");
    worksheet.columns = [
      { header: "price", key: "price" },
      { header: "to", key: "to" },
      { header: "from", key: "from" },
      { header: "create", key: "created" },
      { header: "success", key: "success" },
    ];
    order.forEach((e) => {
      worksheet.addRow(e);
    });
    try {
      const buffer = await workbook.xlsx.writeBuffer();
      if (await sendmail(maileExcel(email, filename, buffer))) return data;
    } catch (error) {
      const up = new functions.https.HttpsError(
        "invalid-argument",
        error.message,
      );
      throw up;
    }
  });
