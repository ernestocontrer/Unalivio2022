import axios from 'axios-https-proxy-fix';
// npm i --save axios-https-proxy-fix

const url = 'https://sandbox.123pago.net/msBotonDePago/index.jsp';

const requestPago = async (email, to, amount) => {
	const data = {
		nbproveedor: 'UNALIVIO TEST',
		nb: 'asdddlmk',
		ap: 'trtttmk',
		ci: '99888127',
		em: email,
		cs: '9bb4cde193775ec6f4cb8c4a724432a0',
		nai: `${Date.now()}`,
		co: 'qweljgjvjg',
		mt: amount,
		tl: +to,
		width: '190px',
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
		res = response.data;
	});
	return res;
};
export default requestPago;
