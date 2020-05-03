import React from "react";
import {createMemoryHistory} from "history";
import {Route, Router, Switch} from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.4.0";
import 'typeface-roboto';
import 'typeface-roboto-slab';
// pages for this product
//import Components from "./Components/Components.jsx";
import LandingPage from "./LandingPage/LandingPage.jsx";
//import ProfilePage from "./ProfilePage/ProfilePage.jsx";
//import LoginPage from "./LoginPage/LoginPage.jsx";
import FirebaseProvider from "components/FirebaseProvider/FirebaseProvider.jsx"
import MercadoPagoProvider from "components/MercadoPagoProvider/MercadoPagoProvider.jsx"

let hist = createMemoryHistory();

export default () => (<FirebaseProvider>
  <MercadoPagoProvider>
    <Router history={hist}>
      <Switch>
        <Route path="/" component={LandingPage} />
      </Switch>
    </Router>
  </MercadoPagoProvider>
</FirebaseProvider>);
