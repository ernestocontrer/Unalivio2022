import { spawnApi } from 'services/emulator-suite';
const calls = {
	create: 'generateOrder',
};

const orders = firebase => {
	const api = spawnApi(firebase);
	return {
		create: order => api.httpsCallable(calls.create)(order),
	};
};

export default orders;
