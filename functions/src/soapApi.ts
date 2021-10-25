const soap = require("soap-as-promised");
import generateUuid from "./generateUuid";

const PayallRequest = (/* to: number, amount: number, id: any */) => {
  const uuid = generateUuid("123456789", 17);
  const url = "http://164.52.144.203:9967/payall/ws?wsdl";
  let args = {
    arg0: {
      uuid: uuid,
      numero: "0424907089",
      monto: "40000",
      operadora: "movistar",
      producto: "01",
      pv: "4348",
      pin: "81264062",
      key: "HOcpMcgEDA4FEYX",
      code: "####",
    },
  };
  soap.createClient(url)
    .then((client:any) => {
      client
        .recargar(args)
        .then((responce:any) => {
          console.log("responce", responce);
        })
        .catch((error:any) => {
          console.log("errro1", error);
        });
    })
    .catch((error:any) => {
      console.log("error2", error);
    });
};

export default PayallRequest;
