import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import PropTypes from 'prop-types'


import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// React icons

// core components
import Master from "components/Master/Master.jsx"

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import masterPageStyle from "assets/jss/material-kit-react/components/masterPage.jsx";

// Sections for this page
import StartSection from "./Sections/StartSection.jsx"
import EncryptionSection from "./Sections/EncryptionSection.jsx";
import StepsSection from "./Sections/StepsSection.jsx";
import CitySection from "./Sections/CitySection.jsx"
import ProductSection from "./Sections/ProductSection.jsx";

import Parallax from "components/Parallax/Parallax.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import { Divider } from "@material-ui/core";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";

import { AnchorLink } from "gatsby-plugin-anchor-links";

import { withFirebase } from 'components/FirebaseProvider/FirebaseProvider.jsx';

const SEO = {
  title: 'UnAlivio Combos',
  pathname: '/mercado'
}

const MasterPage = withStyles(masterPageStyle)(Master)

const GroceriesPage = ({seo, classes, firebase, ...rest}) => (<MasterPage 
  seo={SEO}
  poster="/bg.jpg"
  video={false}
  firebase={firebase}
  {...rest}
>
  <Parallax filter >
    <div className={classes.container}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <h1 className={classes.title}>Alivia a tus seres queridos en Venezuela con un mercado a domicilio</h1>
          <h4 className={classes.note}>
            <span style={{fontWeight: "bold"}}>Unalivio</span> es la única plataforma que te
            comprar productos primordiales y entregarlos
            seres queridos en <span style={{fontWeight: "bold"}}>Venezuela</span> de forma
            fácil, rápida y segura.
          </h4>
          <br />
          <AnchorLink to="/mercado/#combo">
            <Button
              color="secondary"
              size="lg"
              onClick={() => {}}
              rel="noopener noreferrer"
              round
            >
              ENVIAR COMBO
            </Button>
          </AnchorLink>
          <br />
        </GridItem>
      </GridContainer>
    </div>
  </Parallax>
  <div className={classNames(classes.main, classes.mainRaised)}>
    <div className={classes.fullWidthContainer}>
      <StartSection />
      <EncryptionSection />
      <StepsSection />
      <CitySection />
      <ProductSection />
    </div>
  </div>
</MasterPage>)

export default withStyles(landingPageStyle)(withFirebase(GroceriesPage));
