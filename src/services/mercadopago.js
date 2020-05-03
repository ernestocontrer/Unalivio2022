const config = {
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
}

let mercadopagoCache

const getMercadoPago = mercadopago => {
  if (mercadopagoCache) return mercadopagoCache;

  mercadopago.configure(config);
  mercadopagoCache = mercadopago;
  return mercadopago;
}

export default getMercadoPago;