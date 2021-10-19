import axios from 'axios-https-proxy-fix';

const url = process.env.PAGO_SANDBOX_URL;

const requestPago = async (email, to, amount) => {
	const data = {
		nbproveedor: process.env.PAGO_NAMEPROVIDER,
		nb: 'anonymous',
		ap: 'test_123Pago',
		ci: '99888127',
		em: email,
		cs: process.env.PAGO_APIKEY,
		nai: `${Date.now()}`,
		co: 'anonymous',
		mt: amount,
		tl: +to,
		width: process.env.PAGO_WIDTH,
	};
	let res;
	await axios({
		method: 'post',
		url: url,
		headers: {
			'Content-type': 'application/x-www-form-urlencoded',
		},
		params: data,
	}).then(response => {
		res = response;
	});
	return res;
};
export default requestPago;
