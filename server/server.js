const express = require("express");
const soap = require("soap-as-promised");
const cors = require("cors");
const {generate_UUID} = require('./config')


const PORT = 8080;

const app = express();
app.use(express.json());
app.use(cors());

const VPN_URL = '10.128.0.11:8080';


const PAYALL_TRANSACTION_URL = `http://172.20.73.215:9967/payall/ws?wsdl`;

// const PAYALL_TRANSACTION_URL = `http://10.128.0.11:8080`;
// const PAYALL_TRANSACTION_URL = `http://10.128.0.11:8080/payall/ws?wsdl`;

const createPayallTransaction = async (req, res) => {
  console.log(`Body: ${JSON.stringify(req.body)}`)
  const {data, time, id} = req.body.options;
  console.log(`Transaction Data: ${JSON.stringify(data)}`)
  const uuid = generate_UUID("123456789", 18);
  console.log(`UUID: ${uuid}`)

  const phoneNumber = data.to.replace(/-/g, "");
  const args = {
    arg0: {
      uuid: uuid,
      numero: phoneNumber,
      monto: data.price,
      operadora: data.product,
      // producto: getProducto(data.product),
      producto: req.body.producto,
      pv: "157556",
      pin: "50692340",
      key: "KPl719_qPULPTev",
      code: "####",
    },
  };
  console.log(args);
  try {
    const client = await soap.createClient(PAYALL_TRANSACTION_URL);
   //  const client2 = await soap.createClient(PAYALL_TRANSACTION_URL2);


    const result = await client.recargar(args);
    // const result2 = await client2.recargar(args);

    console.log({result})

    const recargarResponse = result.return;

    const responseData = {
      responseCode: recargarResponse.codigo_respuesta,
      message: recargarResponse.string,
      code: 'Payall'
    }

    if (recargarResponse.codigo_respuesta === "00") {
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

const getPayallBalance = async (req, res) => {
  console.log('[GET PAYALL BALANCE] ', req.body);
  const {maxAmount} = req.body;

  const args = {
    arg0: {
      pv: "4348", //idPV
      pin: "81264062", //pin
      key: "HOcpMcgEDA4FEYX", //IMEI22
      code: "####", //mac
    },
  };

console.log({args});

  try {
    // const soapClient = await soap.createClient(PAYALL_TRANSACTION_URL);
    const soapClient2 = await soap.createClient(PAYALL_TRANSACTION_URL);
    console.log({soapClient2});

    // const saldoResponse = await soapClient.saldo(args);
    const saldoResponse2 = await soapClient2.saldo(args);

    console.log({saldoResponse2});

    return saldoResponse2
    // return !(maxAmount * 5 >= saldoResponse.return.saldo_disponible);

  } catch (e) {

    console.error(e);
    return e;
  };
}

app.get("/", (req, res) => {
  res.send("Hello World! Server is running on port: " + PORT);
});

app.post("/recargar", async (req, res) => {
  const result = await createPayallTransaction(req, res);
  return res.send(result);
});

app.post("/getBalance", async (req, res) => {
  try {
    const result = await getPayallBalance(req, res);
    return res.send(result);
  } catch (e) {
    console.error(e);
    return res.send(e);
  }

});

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`server are listening on ${host} and ${port}`);
});