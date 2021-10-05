import { spawnDb } from 'services/emulator-suite';

const calls = {
	list: 'products-list',
};

const products = firebase => {
	const db = spawnDb(firebase);
	const productsRef = db.collection('products');
	return {
		list: (offering = 'topup') =>
			productsRef
				.where('offering', '==', db.doc(`offerings/${offering}`))
				.get()
				.then(snap =>
					snap.docs.map(product => ({
						name: product.data().name,
						value: product.id,
						price: product.data().price,
					}))
				),
	};
};

export default products;
