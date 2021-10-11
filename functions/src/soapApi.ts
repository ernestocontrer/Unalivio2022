// // import * as soap from 'soap';
// import generateUuid from './generateUuid';
//
// const FetchRequest = (to: number, amount: number, id: any) => {
// 	const uuid = generateUuid('123456789', 17);
// 	const url = 'http://164.52.144.203:9967/payall/ws?wsdl';
// 	let args = {
// 		arg0: {
// 			uuid: uuid,
// 			numero: to,
// 			monto: amount,
// 			operadora: 'movistar',
// 			producto: '41',
// 			pv: 'PUNTO',
// 			pin: 'PIN',
// 			key: id,
// 			code: 'CODE',
// 		},
// 	};
// 	// soap.createClient(url, function (err, client) {
// 	// 	client.recargar(args, function (err: any, result: any) {
// 	// 		console.log(result);
// 	// 	});
// 	// });
// };
//
// export default FetchRequest;
