const config =  {
		apiKey: "AIzaSyAkvloEt1pfB7ihmh9l-SN3EP68TG--q-c",
		authDomain: "aliviame-mvp.firebaseapp.com",
		databaseURL: "https://aliviame-mvp.firebaseio.com",
		projectId: "aliviame-mvp",
		storageBucket: "aliviame-mvp.appspot.com",
		messagingSenderId: "1017861162472",
		appId: "1:1017861162472:web:d3e5b173fa30a8a4f2905d",
		measurementId: "G-1Y0N8RC58T"
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
