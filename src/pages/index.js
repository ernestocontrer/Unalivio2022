import React from "react";
import {createMemoryHistory} from "history";
import {Route, Router, Switch} from "react-router-dom";

import FirebaseProvider from "components/FirebaseProvider/FirebaseProvider.jsx"
import StripeProvider from 'components/StripeProvider/StripeProvider.jsx'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { SnackbarProvider } from "notistack";

import "assets/scss/material-kit-react.scss?v=1.4.0";
import 'typeface-roboto';
import 'typeface-roboto-slab';
// pages for this product
//import Components from "./Components/Components.jsx";
import LandingPage from "./LandingPage/LandingPage.jsx";
//import ProfilePage from "./ProfilePage/ProfilePage.jsx";
//import LoginPage from "./LoginPage/LoginPage.jsx";

let hist = createMemoryHistory();

export default () => {
  return (<GoogleReCaptchaProvider
    reCaptchaKey={process.env.RECAPTCHA_KEY}
    language="es"
  >
    <SnackbarProvider>
      <StripeProvider>
        <FirebaseProvider>
          <Router history={hist}>
            <Switch>
              <Route path="/" component={(LandingPage)} />
            </Switch>
          </Router>
        </FirebaseProvider>
      </StripeProvider>
    </SnackbarProvider>
  </GoogleReCaptchaProvider>)
};
