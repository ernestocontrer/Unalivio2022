const spawnDb = firebase => {
	const db = firebase.firestore();
	if (window.location.hostname === 'localhost') {
		db.settings({
			host: 'localhost:8080',
			ssl: false,
		});
	}
	return db;
};

const spawnApi = firebase => {
	const api = firebase.functions();
	if (window.location.hostname === 'localhost') {
		api.useFunctionsEmulator(process.env.FIREBASE_FUNCTIONS_URL);
	}
	return api;
};

export { spawnApi, spawnDb };
