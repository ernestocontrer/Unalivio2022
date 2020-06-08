/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
import { List, ListItem, withStyles } from "@material-ui/core";

// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";

import footerStyle from "assets/jss/material-kit-react/components/footerStyle.jsx";

function Footer({ ...props }) {
  const { classes, whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                href="privacy"
                className={classes.block}
                target="_blank"
              >
                Política de Privacidad
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="tos"
                className={classes.block}
                target="_blank"
              >
                Términos de Servicio
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="support"
                className={classes.block}
                target="_blank"
              >
                Ayuda
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                href="investors"
                className={classes.block}
                target="_blank"
              >
                Inversionistas
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right}>
          &copy; {1900 + new Date().getYear()} ALIVIAME S. A. DE C. V., {" "}
          Hecho con <Favorite className={classes.icon} /> en{" "}
          México y Venezuela por{" "}
          <a
            href="https://blitmx.com"
            className={aClasses}
            target="_blank"
          >
            BLIT
          </a>{" "}
          para una mejor vida.
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool
};

export default withStyles(footerStyle)(Footer);
