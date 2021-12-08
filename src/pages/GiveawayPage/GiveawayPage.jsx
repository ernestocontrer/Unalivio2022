import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components

import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// React icons

// core components
import Master from "components/Master/Master.jsx";

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import masterPageStyle from "assets/jss/material-kit-react/components/masterPage.jsx";

// Sections for this page

import ProductSection from "./Sections/ProductSection.jsx";

import Parallax from "components/Parallax/Parallax.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";

import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";

import { AnchorLink } from "gatsby-plugin-anchor-links";

import { withFirebase } from "components/FirebaseProvider/FirebaseProvider.jsx";

const SEO = {
  title: "Unalivio",
  pathname: "/",
};

const MasterPage = withStyles(masterPageStyle)(Master);

const GiveawayPage = ({ seo, classes, firebase, ...rest }) => (
  <MasterPage
    seo={SEO}
    poster="/bg.png"
    video={false}
    firebase={firebase}
    {...rest}
  >
    <Parallax filter>
      <div className={classes.container}>
        <GridContainer>
          <GridItem xs={12} sm={12} md={6}>
            <h1 className={classes.title}>
              Regálale Unalivio a tus seres queridos en Venezuela con una
              recarga
            </h1>
            <h4 className={classes.note}>
              <span style={{ fontWeight: "bold" }}>Unalivio</span> es la única
              plataforma que te permite recargar los teléfonos de tus seres
              queridos en <span style={{ fontWeight: "bold" }}>Venezuela</span>{" "}
              de forma fácil, rápida y segura. ¡Si tienes un código de regalo
              promocional puedes hacerlo ya!
            </h4>
            <br />
            <AnchorLink to="/regala#topup">
              <Button
                color="secondary"
                size="lg"
                onClick={() => {}}
                rel="noopener noreferrer"
                round
              >
                RECARGAR SALDO
              </Button>
            </AnchorLink>
            <br />
          </GridItem>
        </GridContainer>
      </div>
    </Parallax>
    <div className={classNames(classes.main, classes.mainRaised)}>
      <div className={classes.fullWidthContainer}>
        {/*
        <StartSection />
        <EncryptionSection />
        <StepsSection />
      */}
        <ProductSection />
      </div>
    </div>
  </MasterPage>
);

export default withStyles(landingPageStyle)(withFirebase(GiveawayPage));
