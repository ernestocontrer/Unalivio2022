const express = require("express");
const soap = require("soap-as-promised");
const cors = require("cors");
const generateUuid = require("../functions/src/generateUuid");
const {getProducto, getTime, addElemToOrder, addElemToOrdersWithProblems} = require("../functions/src/api");
const sendmail = require("../functions/src/sendmail");
const {mailSuccess, mailUnSuccess} = require("../functions/src/emails");
const {code} = require("../functions/src/statusCodes/payallCodereacargarResponse");
const app = express();
app.use(cors());

const VPN_URL = '10.128.0.11:8080';


const PAYALL_TRANSACTION_URL = `${VPN_URL}/payall/ws?wsdl`;


const generateUuid = (ABC, length) => {
  const alphabet = ABC;
  const nanoid = customAlphabet(alphabet, length);
  let uuid = nanoid().toString().split('');
  uuid.splice(4, 0, '_0');
  return (uuid = '0' + uuid.join(''));
};


const createPayallTransaction = async (req, res) => {
  const {data, time, id} = req.body.options;

  const uuid = generateUuid("123456789", 17);

  const phoneNumber = data.to.replace(/-/g, "");
  const args = {
    arg0: {
      uuid: uuid,
      numero: phoneNumber,
      monto: data.price,
      operadora: data.product,
      // producto: getProducto(data.product),
      producto: req.body.producto,
      pv: "4348",
      pin: "81264062",
      key: "HOcpMcgEDA4FEYX",
      code: "####",
    },
  };
  console.log(args);
  try {
    const client = await soap.createClient(PAYALL_TRANSACTION_URL);

    const reacargarResponse = await client.recargar(args);

    const responseData = {
      responseCode: reacargarResponse?.return?.codigo_respuesta,
      message: reacargarResponse?.return?.string,
      code: 'Payall'
    }

    if (reacargarResponse.return.codigo_respuesta === "00") {
      return {
        success: true,
        ...responseData
      }
    } else {
      return {
        success: false,
        ...responseData
      }
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
    }
  }
}


app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/recargar", async (req, res) => {
  const result = await createPayallTransaction(req, res);

  res.send(result);
});


const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`server are listening on ${host} and ${port}`);
});
