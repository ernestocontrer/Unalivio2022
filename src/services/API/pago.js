import axios from 'axios-https-proxy-fix';

// const url = process.env.PAGO_SANDBOX_URL;


const pago_config = {
	sandbox_url: 'https://sandbox.123pago.net/msBotonDePago/index.jsp',
	provider_name: 'UNALIVIO TEST',
	api_key: '9bb4cde193775ec6f4cb8c4a724432a0',
	btn_width: '190px'
}
const requestPago = (email, to, amount) => {
	const data = {
		nbproveedor: pago_config.provider_name,
		nb: 'anonymous',
		ap: 'test_123Pago',
		ci: '99888127',
		em: email,
		cs: pago_config.api_key,
		nai: `${Date.now()}`,
		co: 'anonymous',
		mt: amount,
		tl: +to,
		width: pago_config.btn_width,
	};
	return axios({
		method: 'post',
		url: pago_config.sandbox_url,
		headers: {
			'Content-type': 'application/x-www-form-urlencoded',
		},
		params: data,
	});

};
export default requestPago;
