import { defaultFont } from "assets/jss/material-kit-react.jsx";

import tooltip from "assets/jss/material-kit-react/tooltipsStyle.jsx";

const headerLinksStyle = (theme) => ({
  buttonRecargaYa: {
    background: "#ffd60a",
    padding: "12px 22px",
    borderRadius: "100px",
    margin: "12px 0",
    marginLeft: "38px",
    textTransform: "none",
    fontFamily: "Montserrat",
    fontSize: "16px",
    fontWeight: "bold",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "normal",
    letterSpacing: "0.21px",
    textAlign: "center",
    color: "#0a7aff",
    boxShadow:
      "0 2px 2px 0 rgba(156, 39, 176, 0.14), 0 1px 5px 1px rgba(156, 39, 176, 0.5)",
    "&:hover": {
      background: "#038DDA",
    },
    "&:focus": {
      background: "#038DDA",
      boxShadow: "0 2px 5px #e85d04",
    },
    "@media (max-width: 1281px)": {
      padding: "12px 18px",
    },
  },
  list: {
    ...defaultFont,
    fontSize: "14px",
    margin: 0,
    paddingLeft: "0",
    listStyle: "none",
    paddingTop: "0",
    paddingBottom: "0",
    color: "#ffffff",
    "@media (max-width: 1280px)": {
      transform: "scale(0.9)",
    },
  },
  listItem: {
    float: "left",
    color: "inherit",
    position: "relative",
    display: "block",
    width: "auto",
    margin: "0",
    padding: "0 6px",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      "&:after": {
        width: "calc(100% - 30px)",
        content: '""',
        display: "block",
        height: "1px",
        marginLeft: "15px",
        backgroundColor: "#e5e5e5",
      },
    },
  },
  listItemText: {
    padding: "0 !important",
  },
  navLink: {
    color: "inherit",
    position: "relative",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    "&:hover,&:focus": {
      color: "inherit",
      background: "rgba(200, 200, 200, 0.2)",
    },
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 30px)",
      marginLeft: "15px",
      marginBottom: "8px",
      marginTop: "8px",
      textAlign: "left",
      "& > span:first-child": {
        justifyContent: "flex-start",
      },
    },
  },
  notificationNavLink: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
    top: "4px",
  },
  registerNavLink: {
    top: "3px",
    position: "relative",
    fontWeight: "400",
    fontSize: "12px",
    textTransform: "uppercase",
    lineHeight: "20px",
    textDecoration: "none",
    margin: "0px",
    display: "inline-flex",
  },
  navLinkActive: {
    color: "inherit",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  icons: {
    width: "20px",
    height: "20px",
    marginRight: "3px",
  },
  socialIcons: {
    position: "relative",
    fontSize: "20px !important",
    marginRight: "4px",
  },
  dropdownLink: {
    "&,&:hover,&:focus": {
      color: "inherit",
      textDecoration: "none",
      display: "block",
      padding: "10px 20px",
    },
  },
  ...tooltip,
  marginRight5: {
    marginRight: "5px",
  },
});

export default headerLinksStyle;
