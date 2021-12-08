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

import startStyle from "assets/jss/material-kit-react/views/landingPageSections/startStyle.jsx";

const AnytimeIcon = () => (
  <img src={anytimeIcon} style={{ maxHeight: "80px" }} alt={"AnytimeIcon"} />
);
const SecurityIcon = () => (
  <img src={securityIcon} style={{ maxHeight: "80px" }} alt={"SecurityIcon"} />
);
const MoneyIcon = () => (
  <img src={moneyIcon} style={{ maxHeight: "80px" }} alt={"MoneyIcon"} />
);

class StartSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.background} id="porque">
        <div className={classes.section}>
          <GridContainer justify="center">
            <GridItem cs={12} sm={12} md={6}>
              <h2 className={classes.title}>
                ¿Por qué el mercado de tus seres queridos con Unalivio?
              </h2>
              <h4 className={classes.description}>
                Al llenar el formulario sólo te pedimos tu email, el nombre y
                número de contacto para la entrega, monto en bolívares, combo a
                comprar a recargar y método de pago.{" "}
                <span style={{ fontWeight: "bold" }}>Es muy sencillo.</span>
              </h4>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <InfoArea
                    title="Siempre disponible"
                    description="Nuestra plataforma funciona todo el año 24/7 para tí"
                    icon={AnytimeIcon}
                    iconColor="white"
                    vertical
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <InfoArea
                    title="Siempre seguro"
                    description="Las mejores medidas de seguridad para proteger tus datos"
                    icon={SecurityIcon}
                    iconColor="white"
                    vertical
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <InfoArea
                    title="Siempre conviene"
                    description="Tu dinero no se deprecia en el tiempo por inflación o riesgo cambiario"
                    icon={MoneyIcon}
                    iconColor="white"
                    vertical
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(startStyle)(StartSection);
