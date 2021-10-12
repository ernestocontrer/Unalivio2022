
const https = require('https');
https.post = require('https-post');

const url = 'https://sandbox.123pago.net/msBotonDePago/index.jsp';
const res = '';
const data = {
	nbproveedor: 'UNALIVIO TEST',
	nb: 'asdddlmk',
	ap: 'trtttmklm',
	ci: '99888127',
	em: 'DevTestForNov@gmail.com',
	cs: '9bb4cde193775ec6f4cb8c4a724432a0',
	nai: `${Date.now()}`,
	co: 'qweerrrrr',
	mt: '100',
	tl: 4144131804,
	width: '190px',
};

const requestPago = () => {
	https.post(url, data, (res: any) => {
		res.setEncoding('utf8');
		res.on('data', (chunk: any) => {
			res = chunk;
			console.log('res134', res);
		});
	});
	return res;
};

export default requestPago;


