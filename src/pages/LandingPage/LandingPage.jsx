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
import ProductSection from "./Sections/ProductSection.jsx";

import Parallax from "components/Parallax/Parallax.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import { Divider } from "@material-ui/core";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";



const SEO = {
  title: 'Unalivio'
}

const MasterPage = withStyles(masterPageStyle)(Master)

const LandingPage = ({seo, classes, ...rest}) => (<MasterPage 
  seo={SEO}
  poster="/bg.jpg"
  video={false}
  {...rest}
>
  <Parallax filter >
    <div className={classes.container}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <h1 className={classes.title}>Alivia el teléfono de tus seres queridos en Venezuela</h1>
          <h4 className={classes.note}>
            <span style={{fontWeight: "bold"}}>Unalivio</span> es la única plataforma que te
            permite recargar los teléfonos de tus
            seres queridos en <span style={{fontWeight: "bold"}}>Venezuela</span> de forma
            fácil, rápida y segura.
          </h4>
          <br />
          <Button
            color="secondary"
            size="lg"
            onClick={() => { console.log('#name'); }}
            rel="noopener noreferrer"
            round
          >
            RECARGAR SALDO
          </Button>
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
      <ProductSection />
    </div>
  </div>
</MasterPage>)

export default withStyles(landingPageStyle)(LandingPage);
