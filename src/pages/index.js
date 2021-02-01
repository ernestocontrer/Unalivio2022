import React from "react";
import {createMemoryHistory} from "history";
import {Route, Router, Switch} from "react-router-dom";

import '@stripe/stripe-js';
import "assets/scss/material-kit-react.scss?v=1.4.0";
import 'typeface-roboto';
import 'typeface-montserrat';
// pages for this product
//import Components from "./Components/Components.jsx";
import LandingPage from "./LandingPage/LandingPage.jsx";
import GroceriesPage from "./GroceriesPage/GroceriesPage.jsx"
import PrivacyPage from "./PrivacyPage/PrivacyPage.jsx"
import GiveawayPage from "./GiveawayPage/GiveawayPage.jsx";
//import ProfilePage from "./ProfilePage/ProfilePage.jsx";
//import LoginPage from "./LoginPage/LoginPage.jsx";

let hist = createMemoryHistory();

export default () => {
  return (<Router history={hist}>
    <Switch>
      <Route path="/" component={(LandingPage)} />
      <Route path="/mercado" component={(GroceriesPage)} />
      <Route path="/privacy" component={ PrivacyPage } />
      <Route path="/regala" component={ GiveawayPage } />
    </Switch>
  </Router>)
};
