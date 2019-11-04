import React from "react";
// nodejs library that concatenates classes
//import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// React icons

// core components
import Master from "components/Master/Master.jsx"

import aboutPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";

// Sections for this page
import ProductSection from "./Sections/ProductSection.jsx";

const SEO = {
  title: 'Aliviame'
}

const MasterPage = withStyles(aboutPageStyle)(Master)

const LandingPage = ({seo, ...rest}) => (<MasterPage 
  seo={SEO}
  {...rest}
>
  <ProductSection />
</MasterPage>)

export default LandingPage;
