const express = require("express");
const soap = require("soap-as-promised");
const cors = require("cors");
const {generate_UUID} = require('./config')


const app = express();
app.use(cors());

const VPN_URL = '10.128.0.11:8080';


const PAYALL_TRANSACTION_URL = `${VPN_URL}/payall/ws?wsdl`;

const createPayallTransaction = async (req, res) => {
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

const getPayallBalance = async (req, res) => {

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

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`server are listening on ${host} and ${port}`);
});
