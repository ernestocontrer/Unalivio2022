import React from "react";
// nodejs library that concatenates classes
//import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// React icons
import teamStyle from "assets/jss/material-kit-react/views/aboutPageSections/teamStyle.jsx";


class TeamSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <h2 className={classes.title}>Aviso Legal</h2>
        <p className={classes.description}>
          Esta página puede ser reproducida con fines no lucrativos, siempre y cuando no se mutile, ni se omita la fuente completa ni su dirección electrónica bajo los términos de la licencia <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.es" >CC BY-NC-SA 4.0</a>.<br />
          De otra forma, requiere permiso previo por escrito por parte de UNALIVIO S. A. P. I. DE C. V.
        </p>  
      </div>
    );
  }
}

export default withStyles(teamStyle)(TeamSection);
