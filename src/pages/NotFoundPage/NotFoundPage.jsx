import React from "react";
// nodejs library that concatenates classes
//import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// React icons

// core components
import Master from "components/Master/Master.jsx"

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";


const SEO = {
  title: 'No encontrado'
}

const MasterPage = withStyles(landingPageStyle)(Master)

const NotFoundPage = ({seo, classes, ...rest}) => (<MasterPage 
  seo={SEO}
  {...rest}
>
  <h1 className={classes.title}>¡No encontrado!</h1>
  <a className={classes.subtitle} target="/">Regresar al inicio</a>
</MasterPage>)

export default NotFoundPage;
