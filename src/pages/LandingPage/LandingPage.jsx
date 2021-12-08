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
import StartSection from "./Sections/StartSection.jsx";
import EncryptionSection from "./Sections/EncryptionSection.jsx";
import StepsSection from "./Sections/StepsSection.jsx";
import ProductSection from "./Sections/ProductSection.jsx";

import Parallax from "components/Parallax/Parallax.jsx";

import { withFirebase } from "components/FirebaseProvider/FirebaseProvider.jsx";

import page from "./landingPage.module.css";

const SEO = {
  title: "Unalivio",
  pathname: "/",
};

const MasterPage = withStyles(masterPageStyle)(Master);

const LandingPage = ({ seo, classes, firebase, ...rest }) => {
  return (
    <MasterPage
      seo={SEO}
      poster="/bg.png"
      video={false}
      firebase={firebase}
      {...rest}
    >
      <Parallax>
        <div className={[classes.container, page.block].join(" ")}></div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.fullWidthContainer}>
          <StartSection />
          <EncryptionSection />
          <StepsSection />
          <ProductSection />
        </div>
      </div>
    </MasterPage>
  );
};

export default withStyles(landingPageStyle)(withFirebase(LandingPage));
