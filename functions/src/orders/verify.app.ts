import * as express from 'express'
import * as bodyParser from 'body-parser'
import Stripe from 'stripe';
//import * as functions from 'firebase-functions';

//const endpointSecret = functions.config().stripe.signing_key;//process.env('STRIPE_ENDPOINT_SECRET');

export const verifyApp = (stripe: Stripe, callbacks: any) => {
  const app = express();
  
  // Use body-parser to retrieve the raw body as a buffer
  /* app.use(bodyParser.json({
    verify: function (req, res, buf) {
      //const url = req['originalUrl'];
      /* console.log(url);
      if (url.startsWith('/stripe')) {
        req['rawBody'] = buf.toString();
      } * /
    }
  })); */
  app.use(bodyParser.raw({type: 'application/json'}));

  // Match the raw body to content type application/json
  app.post('/', async (req, res) => {
    let event: Stripe.Event;

    try {
      //event = stripe.webhooks.constructEvent(req['rawBody'], `${req.headers['stripe-signature']}`, endpointSecret);
      event = req.body;
    } catch (err) {
      console.error(err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    try {
      await callbacks[event.type](event.data.object);
      // Return a 200 response to acknowledge receipt of the event
      return res.json({received: true});
    } catch(err) {
      console.error(err.message);
      if (!!event.data.object || !!event.data) return res.status(400).send(`Malformed data: ${event.data}`)
      return res.status(400).send(`Unexpected event type: ${event.type}`)
    }
  });

  return app;
}


