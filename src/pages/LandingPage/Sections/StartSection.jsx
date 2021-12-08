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
            <GridItem cs={12} sm={12} md={8}>
              <h2 className={classes.title + " " + section.title_1}>
                ¿Por qué recargar tu teléfono, o aliviar el telefono de tus
                seres queridos con unalivio?
              </h2>
              <h4
                className={classes.description + " " + section.text}
                style={{ fontWeight: "bold" }}
              >
                Al llenar el formulario, sólo te pedimos tu email, número de
                celular y monto a recargar, compañia a recargar. Seleccionas el
                método de pago y listo.
                <span style={{ fontWeight: "bold", color: "#0084ff" }}>
                  {" "}
                  ¡Es muy sencillo!
                </span>
              </h4>
              <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                  <InfoArea
                    title={<b>Siempre disponible</b>}
                    description={
                      <b>
                        Nl te preocupes por la hora o si estas en lista.
                        ¡Siempre puedes recargar!
                      </b>
                    }
                    icon={AnytimeIcon}
                    iconColor="white"
                    vertical
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <InfoArea
                    title={<b> Siempre seguro</b>}
                    description={
                      <b>
                        Las mejores medidas de seguridad para proteger tus datos{" "}
                      </b>
                    }
                    icon={SecurityIcon}
                    iconColor="white"
                    vertical
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <InfoArea
                    title={<b> Siempre conviene</b>}
                    description={<b>Paga con minima comisión y ofertas!</b>}
                    icon={MoneyIcon}
                    iconColor="white"
                    vertical
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={3}>
                  <InfoArea
                    title={<b> Pago móvil</b>}
                    description={<b>Utiliza tu pago movil sin problemas!</b>}
                    icon={Phone}
                    iconColor="white"
                    vertical
                  />
                </GridItem>
              </GridContainer>

              <AnchorLink to="/#topup">
                {/* <Button
									color='secondary'
									size='lg'
									rel='noopener noreferrer'
									round
									className={section.buttonRecargar}
								>
									RECARGAR SALDO
								</Button> */}
              </AnchorLink>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(startStyle)(StartSection);
