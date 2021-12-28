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
import moneyIcon from "assets/img/icons/dinero.png";
import phone from "assets/img/icons/Icon2.png";
import startStyle from "assets/jss/material-kit-react/views/landingPageSections/startStyle.jsx";

import { AnchorLink } from "gatsby-plugin-anchor-links";

// style
import section from "./style/StartSection.module.css";
const Phone = () => (
  <img src={phone} style={{ maxHeight: "120px" }} alt={"Phone"} />
);
const AnytimeIcon = () => (
  <img src={anytimeIcon} style={{ maxHeight: "120px" }} alt={"AnytimeIcon"} />
);
const SecurityIcon = () => (
  <img src={securityIcon} style={{ maxHeight: "120px" }} alt={"SecurityIcon"} />
);
const MoneyIcon = () => (
  <img src={moneyIcon} style={{ maxHeight: "120px" }} alt={"MoneyIcon"} />
);

class StartSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div
        className={[classes.background, section.backgroundSection].join(" ")}
        id="why"
      >
        <div className={classes.section}>
          <GridContainer justify="center">
            <GridItem cs={12} sm={12} md={7}>
              <h2
                className={classes.title + " " + section.title_1}
                style={{ color: "rgb(0, 48, 224)" }}
              >
                ¿Por qué recargar con unalivio?
              </h2>
              <h4
                className={classes.description + " " + section.text}
                style={{ fontWeight: "bold", color: "white" }}
              >
                ¡Es rápido y siempre sirve! Ingresa email, número celular y
                monto! Pagas con pago movil y ya!
              </h4>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <InfoArea
                    title={
                      <b style={{ color: "rgb(0, 48, 224)" }}>
                        Siempre disponible
                      </b>
                    }
                    description={
                      <b style={{ color: "rgb(0, 48, 224)" }}>
                        No te preocupes por la hora o estar en lista. ¡Siempre
                        puedes recargar!
                      </b>
                    }
                    icon={AnytimeIcon}
                    iconColor="white"
                    vertical
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <InfoArea
                    title={
                      <b style={{ color: "rgb(0, 48, 224)" }}>
                        {" "}
                        Siempre seguro
                      </b>
                    }
                    description={
                      <b style={{ color: "rgb(0, 48, 224)" }}>
                        Las mejores medidas de seguridad para proteger tus datos{" "}
                      </b>
                    }
                    icon={SecurityIcon}
                    iconColor="white"
                    vertical
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <InfoArea
                    title={
                      <b style={{ color: "rgb(0, 48, 224)" }}>
                        {" "}
                        Siempre conviene
                      </b>
                    }
                    description={
                      <b style={{ color: "rgb(0, 48, 224)" }}>
                        Paga con baja comisión y ofertas! Utilizando pago movil!
                      </b>
                    }
                    icon={MoneyIcon}
                    iconColor="white"
                    vertical
                  />
                </GridItem>
                {/* <GridItem xs={12} sm={12} md={3}>
                  <InfoArea
                    title={<b> Pago móvil</b>}
                    description={<b>Utiliza tu pago movil sin problemas!</b>}
                    icon={Phone}
                    iconColor="white"
                    vertical
                  />
                </GridItem> */}
              </GridContainer>

              <AnchorLink to="/#topup"></AnchorLink>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(startStyle)(StartSection);
