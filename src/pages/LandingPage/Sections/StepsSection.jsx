import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";

import clickIcon from "assets/img/icons/click.png";
import emailIcon from "assets/img/icons/email.png";
import formIcon from "assets/img/icons/formulario.png";
import cardIcon from "assets/img/icons/tarjeta.png";

import stepsStyle from "assets/jss/material-kit-react/views/landingPageSections/stepsStyle.jsx";

const NumberIcon = (n, className) => () => <h1 className={className}>{n}</h1>;

const ClickIcon = () => <img src={clickIcon} style={{ maxHeight: "40px" }} />;
const EmailIcon = () => <img src={emailIcon} style={{ maxHeight: "40px" }} />;
const FormIcon = () => <img src={formIcon} style={{ maxHeight: "40px" }} />;
const CardIcon = () => <img src={cardIcon} style={{ maxHeight: "40px" }} />;

class StepsSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.background} id="howto">
        <div className={classes.section}>
          <GridContainer justify="center">
            <GridItem cs={12} sm={12} md={6}>
              <h2 className={classes.title}>¿Cómo funciona?</h2>
              <h4
                className={classes.description}
                style={{ color: "white", fontWeight: "bold" }}
              >
                Sólo sigue éstos{" "}
                <span style={{ fontWeight: "bold", color: "#ffd60a" }}>
                  3 simples pasos
                </span>
                , y así podrás recargarle saldo a tus seres queridos en{" "}
                Venezuela. Te avisaremos por correo el estatus de tu recarga
                para que siempre estés tranquilo.
              </h4>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4}>
                  <InfoArea
                    title={
                      <>
                        <h3>
                          <b> Siempre disponible</b>
                        </h3>
                        <span>
                          <b>
                            Nuestra plataforma funciona todo el año 24/7 para tí
                          </b>
                        </span>
                        <br />
                        <br />
                      </>
                    }
                    description={<FormIcon />}
                    icon={NumberIcon("1", classes.number)}
                    iconColor="secondary"
                    vertical
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <InfoArea
                    title={
                      <>
                        <h3>
                          <b> Siempre seguro</b>
                        </h3>
                        <span>
                          <b>
                            Las mejores medidas de seguridad para proteger tus
                            datos
                          </b>
                        </span>
                        <br />
                        <br />
                      </>
                    }
                    description={<CardIcon />}
                    icon={NumberIcon("2", classes.number)}
                    iconColor="secondary"
                    vertical
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <InfoArea
                    title={
                      <>
                        <h3>
                          <b> Siempre conviene</b>
                        </h3>
                        <span>
                          <b>
                            Tu dinero no se deprecia en el tiempo por inflación
                            o riesgo cambiario
                          </b>
                        </span>
                      </>
                    }
                    description={<ClickIcon />}
                    icon={NumberIcon("3", classes.number)}
                    iconColor="secondary"
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

export default withStyles(stepsStyle)(StepsSection);
