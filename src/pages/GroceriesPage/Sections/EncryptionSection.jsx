import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import encryptionStyle from "assets/jss/material-kit-react/views/landingPageSections/encryptionStyle.jsx";

class EncryptionSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.background}>
        <div className={classes.section}>
          <GridContainer justify="left">
            <GridItem cs={12} sm={12} md={2} />
            <GridItem cs={12} sm={12} md={6}>
              <h2 className={classes.title}>
                Tus datos están encriptados y seguros al 100%
              </h2>
              <h3 className={classes.description}>
                Nunca guardamos tu método de pago ni tu información sensitiva.
              </h3>
            </GridItem>
            <GridItem cs={12} sm={12} md={4} />
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(encryptionStyle)(EncryptionSection);
