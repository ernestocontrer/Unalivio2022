/*eslint-disable*/
import React from "react";
// react components for routing our app without refresh
import { Link } from "gatsby";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// @material-ui/icons
import { Apps, CloudDownload } from "@material-ui/icons";

// React icons
import { FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Button from "components/CustomButtons/Button.jsx";
import { AnchorLink } from "gatsby-plugin-anchor-links";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

function HeaderLinks({ ...props }) {
  const { classes, links } = props;
  return (
    <List className={classes.list}>
      {links.map((link, k) => <ListItem className={classes.listItem} key={k}>
        <Tooltip
          id={link.id}
          title={link.title}
          placement={typeof window !== 'undefined' && window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          {(link.target == '_anchor')? <AnchorLink to={link.href} title={link.title} className={classes.navLink}>
            <Button
              color="transparent"
              rel="noopener noreferrer"
            >
              {link.children}
            </Button>
          </AnchorLink> : <Button
            href={link.href}
            target={link.target}
            color="transparent"
            className={classes.navLink}
          >
            {link.children}
          </Button>}
        </Tooltip>
      </ListItem>)}
      <ListItem className={classes.listItem}>
        <Tooltip
          id="link-twitter"
          title="¡Síguenos en Twitter!"
          placement={typeof window !== 'undefined' && window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href="https://twitter.com/esunalivio"
            target="_blank"
            className={classes.navLink}
          >
            <FaTwitter/>
          </Button>
        </Tooltip>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-tooltip"
          title="¡Síguenos en Instagram!"
          placement={typeof window !== 'undefined' && window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href="https://www.instagram.com/esunalivio"
            target="_blank"
            className={classes.navLink}
          >
            <FaInstagram/>
          </Button>
        </Tooltip>
      </ListItem>
    </List>
  );
}

export default withStyles(headerLinksStyle)(HeaderLinks);
