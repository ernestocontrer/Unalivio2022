const soap = require("soap-as-promised");
import generateUuid from "./generateUuid";
import { getTime } from "./orders";
import { mailSuccess, mailUnSuccess } from "./emails";
import sendmail from "./sendmail";

const PayallRequest = async (
  db: any,
  data: any,
  timePagoResponce: any,
  id: any,
) => {
  const uuid = generateUuid("123456789", 17);
  const url = "http://164.52.144.203:9967/payall/ws?wsdl";
  const phoneNumber = data.to.replace(/-/g, "");
  console.log(phoneNumber);

  const getProducto = () => {
    let res;
    switch (data.product) {
      case "Movistar":
        res = "01";
        break;
      case "Movilnet":
        res = "61";
        break;
      case "Digitel":
        res = "14";
        break;
    }
    return res;
  };
  const args = {
    arg0: {
      uuid: uuid,
      numero: phoneNumber,
      monto: data.price,
      operadora: data.product,
      producto: getProducto(),
      pv: "4348",
      pin: "81264062",
      key: "HOcpMcgEDA4FEYX",
      code: "####",
    },
  };
  console.log(args);
  soap
    .createClient(url)
    .then((client: any) => {
      client
        .recargar(args)
        .then(async (responce: any) => {
          console.log(responce);
          if (responce.return.codigo_respuesta === "00") {
            if (data.hasCoupon && data.oneOff) {
              await db.collection("numberUsedCoupon").add({ number: data.to });
            }
            await sendmail(mailSuccess(data, getTime(), timePagoResponce, id));
            await db
              .collection("orders")
              .doc(`${id}`)
              .set(data);
            console.log("TTTTTTTTTTTTTTTTT");
          } else {
            console.log("XXXXXXXXXXXXXXXXXXXXXX");
            await db
              .collection("ordersWithProblems")
              .doc(`${data.id}`)
              .set({
                ...data,
                message: responce.return.string,
                problemWith: "Payall",
              });
            await sendmail(
              mailUnSuccess(
                responce.return.codigo_respuesta,
                data,
                getTime(),
                id,
              ),
            );
          }
        })
        .catch((error: any) => {
          console.log("errro1", error);
        });
    })
    .catch((error: any) => {
      console.log("error2", error);
    });
};

export default PayallRequest;
