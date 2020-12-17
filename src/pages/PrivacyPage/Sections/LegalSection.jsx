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
          Esta página no puede ser reproducida parcial o totalmente sin permiso previo por escrito por parte de UNALIVIO S. A. P. I. DE C. V.
        </p>  
      </div>
    );
  }
}

export default withStyles(teamStyle)(TeamSection);
