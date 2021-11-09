const soap = require("soap-as-promised");
import generateUuid from "./generateUuid";
import { mailSuccess, mailUnsuccess } from "./mailPayall";
import sendmail from "./sendmail";

const PayallRequest = () => {
  const uuid = generateUuid("123456789", 17);
  const url = "http://164.52.144.203:9967/payall/ws?wsdl";
  let args = {
    arg0: {
      uuid: uuid,
      numero: "04249070899",
      monto: "4",
      operadora: "Movistar",
      producto: "01",
      pv: "4348",
      pin: "81264062",
      key: "HOcpMcgEDA4FEYX",
      code: "####",
    },
  };
  soap
    .createClient(url)
    .then((client: any) => {
      client
        .recargar(args)
        .then((responce: any) => {
          if (responce.return.codigo_respuesta === "00") {
            sendmail(mailSuccess);
          } else {
            sendmail(mailUnsuccess);
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
