const config = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.FIREBASE_DATABASE_URL,
	projectId: 'process.env.FIREBASE_PROJECT_ID',
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

let firebaseCache;

export const getUiConfig = firebase => ({
	signInFlow: 'popup',
	signInOptions: [
		firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		firebase.auth.EmailAuthProvider.PROVIDER_ID,
	],
});

const getFirebase = firebase => {
	if (firebaseCache) {
		return firebaseCache;
	}

	if (typeof window !== 'undefined') {
		firebase.initializeApp(config);
		firebaseCache = firebase;
		return firebaseCache;
	}

	return null;
};

const lazy = f => {
	let loead;
};

export default getFirebase;
