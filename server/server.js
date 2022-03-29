const express = require("express");
const soap = require("soap-as-promised");
const cors = require("cors");
const {generate_UUID} = require('./config')


const PORT = 3000;

const app = express();
app.use(cors());

const VPN_URL = '10.128.0.11:8080';

const PAYALL_TRANSACTION_URL = `${VPN_URL}/payall/ws?wsdl`;

const createPayallTransaction = async (req, res) => {
  console.log('[CREATE PAYALL TRANSACTION] ', req.body);
  const {data, time, id} = req.body.options;


  const uuid = generate_UUID("123456789", 17);

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

    const result = await client.recargar(args);

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

  const payallPromise = new Promise((resolve, reject) => {
    soap.createClient(PAYALL_TRANSACTION_URL, (err, client) => {
      client.saldo(args, (err, response) => {
        console.log(response.return.saldo_disponible);
        return resolve(!(maxAmount * 5 >= response.return.saldo_disponible));
      });
    });
  });

  return  await payallPromise;
}

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/recargar", async (req, res) => {
  const result = await createPayallTransaction(req, res);
  return res.send(result);
});

app.post("/getBalance", async (req, res) => {
  const result = await getPayallBalance(req, res);
  return res.send(result);
});

const server = app.listen(PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`server are listening on ${host} and ${port}`);
});
