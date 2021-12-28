import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";

import clickIcon from "assets/img/icons/click.png";
import formIcon from "assets/img/icons/formulario.png";
import cardIcon from "assets/img/icons/tarjeta.png";

import stepsStyle from "assets/jss/material-kit-react/views/landingPageSections/stepsStyle.jsx";

const NumberIcon = (n, className) => () => <h1 className={className}>{n}</h1>;

const ClickIcon = () => (
  <img src={clickIcon} style={{ maxHeight: "40px" }} alt={"ClickIcon"} />
);
const FormIcon = () => (
  <img src={formIcon} style={{ maxHeight: "40px" }} alt={"FormIcon"} />
);
const CardIcon = () => (
  <img src={cardIcon} style={{ maxHeight: "40px" }} alt={"CardIcon"} />
);

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
                Sigue tres pasos y podras recargar cualquier teléfono en
                Venezuela. ¡Te avisaremos por correo el estatus de tu recarga!
              </h4>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4}>
                  <InfoArea
                    title={
                      <>
                        <span>
                          <b>
                            Llena el formulario de recarga para el número que
                            desees aliviar
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
                        <span>
                          <b>
                            Verifica tus datos y abre el link para pago movil
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
                        <span>
                          <b>
                            Completa tu pago movil con el numero de transaccion
                            y listo! Te notificaremos la recarga por correo!
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
