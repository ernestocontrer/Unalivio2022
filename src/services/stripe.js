import { loadStripe } from '@stripe/stripe-js';

export const config = {
	public_key: process.env.STRIPE_PUBLIC_KEY,
	options: {},
};

let stripeCache;

const getStripe = () => {
	if (stripeCache) return stripeCache;

	return loadStripe(config.public_key)
		.then(stripe => {
			stripeCache = stripe;
			return stripe;
		})
		.catch(console.error);
};

export default getStripe;
