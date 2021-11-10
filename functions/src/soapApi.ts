const soap = require("soap-as-promised");
import generateUuid from "./generateUuid";
import { mailSuccess, mailUnsuccess } from "./mailPayall";
import sendmail from "./sendmail";

const PayallRequest = (data: any) => {
  const uuid = generateUuid("123456789", 17);
  const url = "http://164.52.144.203:9967/payall/ws?wsdl";
  const phoneNumber = data.to.replace(/-/g, "");
  console.log("data", data);
  let args = {
    arg0: {
      uuid: uuid,
      numero: phoneNumber,
      monto: /* `${data.price}` */ "12",
      operadora: data.product,
      producto: "01",
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
        .then((responce: any) => {
          console.log(responce);
          if (responce.return.codigo_respuesta === "00") {
            console.log("TTTTTTTTTTTTTTTTTTTTTT");
            sendmail(mailSuccess(data.from));
          } else {
            console.log("XXXXXXXXXXXXXXXXXXXXXX");
            sendmail(mailUnsuccess(data.from));
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
