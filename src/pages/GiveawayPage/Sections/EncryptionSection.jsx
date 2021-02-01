import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";

import anytimeIcon from "assets/img/icons/24horas.png";
import securityIcon from "assets/img/icons/seguro.png";
import moneyIcon from "assets/img/icons/dinero.png"


import encryptionStyle from "assets/jss/material-kit-react/views/landingPageSections/encryptionStyle.jsx";


const AnytimeIcon = () => (<img src={anytimeIcon} style={{maxHeight: '80px'}}/>)
const SecurityIcon = () => (<img src={securityIcon} style={{maxHeight: '80px'}}/>)
const MoneyIcon = () => (<img src={moneyIcon} style={{maxHeight: '80px'}}/>)


class EncryptionSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (<div className={classes.background}>
      <div className={classes.section}>
        <GridContainer justify="left">
          <GridItem cs={12} sm={12} md={2} />
          <GridItem cs={12} sm={12} md={6}>
            <h2 className={classes.title}>Tus datos están encriptados y seguros al 100%</h2>
            <h3 className={classes.description}>
              Nunca guardamos tu método de pago ni tu información sensitiva.
            </h3>
          </GridItem>
          <GridItem cs={12} sm={12} md={4} />
        </GridContainer>
      </div>
    </div>);
  }
}

export default withStyles(encryptionStyle)(EncryptionSection);
