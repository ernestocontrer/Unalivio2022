import React, { useState, useEffect } from 'react';

import '@stripe/stripe-js';
import getStripe from 'services/stripe';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';

const withStripe = Component => props =>
	(
		<ElementsConsumer>
			{({ elements, stripe }) => (
				<Component {...props} stripe={stripe} elements={elements} />
			)}
		</ElementsConsumer>
	);

export { withStripe };

export default ({ children }) => {
	const [state, setState] = useState({
		stripe: undefined,
	});

	const init = () => {
		console.log('Initializing stripe');
		const stripe = getStripe();
		setState({ stripe });
	};

	useEffect(
		() => {
			init();
			return () => {
				/* cleanup */
			};
		},
		[
			/* input */
		]
	);

	if (!state.stripe) {
		return null;
	}
	return <Elements stripe={state.stripe}>{children}</Elements>;
};
