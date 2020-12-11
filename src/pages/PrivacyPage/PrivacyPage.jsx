import React from "react";
// nodejs library that concatenates classes
//import classNames from "classnames";
// @material-ui/core components
import Divider from "@material-ui/core/Divider"
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// React icons

// core components
import Master from "components/Master/Master.jsx"

import privacyPageStyle from "assets/jss/material-kit-react/views/aboutPage.jsx";

// Sections for this page
import LegalSection from "./Sections/LegalSection.jsx";
import PrivacyPolicySection from "./Sections/PrivacyPolicySection.jsx";

import { withFirebase } from 'components/FirebaseProvider/FirebaseProvider.jsx';


const SEO = {
  title: 'Política de Privacidad'
}

const MasterPage = withStyles(privacyPageStyle)(Master)

const PrivacyPage = ({seo, classes, firebase, ...rest}) => (<MasterPage 
  seo={SEO}
  firebase={firebase}
  {...rest}
>
  <PrivacyPolicySection />
  <Divider />
  <LegalSection />
</MasterPage>)

export default withStyles(privacyPageStyle)(withFirebase(PrivacyPage));
