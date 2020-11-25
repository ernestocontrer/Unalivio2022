import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import InfoArea from "components/InfoArea/InfoArea.jsx";


import startStyle from "assets/jss/material-kit-react/views/landingPageSections/startStyle.jsx";




const NumberIcon = (n, className) => (() => (<h1 className={className}>{n}</ h1>))


class CitySection extends React.Component {
  render() {
    const { classes } = this.props;
    return (<div className={classes.background} id="porque">
      <div className={classes.section}>
        <GridContainer justify="center">
          <GridItem cs={12} sm={12} md={6}>
            <h2 className={classes.title}>Cerca de tí!</h2>
            <h4 className={classes.description}>
              Selecciona la ciudad donde deseas comprar y el combo que prefieras.
              Trabajamos en las principales ciudades del país, y cubriremos muchas más ciudades pronto.
            </h4>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <InfoArea
                  title="Caracas"
                  description=""
                  icon={NumberIcon("C", classes.number)}
                  iconColor="secondary"
                  vertical
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <InfoArea
                  title="Valencia"
                  description=""
                  icon={NumberIcon("V", classes.number)}
                  iconColor="secondary"
                  vertical
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <InfoArea
                  title="Maracaibo"
                  description=""
                  icon={NumberIcon("M", classes.number)}
                  iconColor="secondary"
                  vertical
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                <InfoArea
                  title="Combo 1"
                  description="Básicos: Harina, detergente, Arroz, Caraotas"
                  icon={NumberIcon("1", classes.number)}
                  iconColor="secondary"
                  vertical
                /> 
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <InfoArea
                  title="Combo 2"
                  description="Comestibles: Harina, Arroz, Caraotas, 1 Pollo, Kg Carne"
                  icon={NumberIcon("2", classes.number)}
                  iconColor="secondary"
                  vertical
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                <InfoArea
                  title="Combo 3"
                  description="Completo: Harina, Arroz, Caraotas, 1 Pollo, Kg Carne, detergentes"
                  icon={NumberIcon("3", classes.number)}
                  iconColor="secondary"
                  vertical
                />
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    </div>);
  }
}

export default withStyles(startStyle)(CitySection);
