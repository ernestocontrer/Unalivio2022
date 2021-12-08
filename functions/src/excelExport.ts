import { /* mailExcel */ test } from "./emails";
import sendmail from "./sendmail";

export const excelExport = async (
  db: FirebaseFirestore.Firestore,
  email: string,
) => {
  const Excel = require("exceljs");
  const filename = "orders.xlsx";
  const orders = (
    await db
      .collection("orders")
      .limit(20)
      .get()
  ).docs.map((doc): any => {
    const data = doc.data();

    return {
      price: data.price,
      to: data.to,
      from: data.from,
    };
  });
  let workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet("Orders");
  worksheet.columns = [
    { header: "price", key: "price" },
    { header: "to", key: "to" },
    { header: "from", key: "from" },
  ];
  orders.forEach((e) => {
    worksheet.addRow(e);
  });
  const buffer = await workbook.xlsx.writeBuffer();
  await sendmail(test(email, filename, buffer));
};
