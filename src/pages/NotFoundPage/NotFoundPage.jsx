import React from "react";
// nodejs library that concatenates classes
//import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// React icons

// core components
import Master from "components/Master/Master.jsx";

import masterPageStyle from "assets/jss/material-kit-react/components/masterPage.jsx";
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";

import Parallax from "components/Parallax/Parallax.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";

const SEO = {
  title: "No encontrado",
};

const MasterPage = withStyles(masterPageStyle)(Master);

const NotFoundPage = ({ seo, classes, ...rest }) => (
  <MasterPage seo={SEO} {...rest}>
    <Parallax filter>
      <div className={classes.container}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <h1 className={classes.title}>¡Muy pronto!</h1>
            <h4 className={classes.note}>Estamos trabajando en ello.</h4>
            <a href="/">
              <Button
                color="secondary"
                size="lg"
                onClick={() => {}}
                rel="noopener noreferrer"
                round
              >
                REGRESAR AL INICIO
              </Button>
            </a>
          </GridItem>
        </GridContainer>
      </div>
    </Parallax>
  </MasterPage>
);

export default withStyles(landingPageStyle)(NotFoundPage);
