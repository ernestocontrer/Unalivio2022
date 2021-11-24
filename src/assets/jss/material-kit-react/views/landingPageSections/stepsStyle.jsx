import {
  cardTitle,
  title,
  primaryColor,
  primaryForeground,
} from "assets/jss/material-kit-react.jsx";
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.jsx";

const stepsStyle = {
  background: {
    //zIndex: 100,
    //top: "50%",
    //left: "50%",
    //top: 0,
    //left: 0,
    minWidth: "100%",
    minHeight: "100%",
    width: "auto",
    height: "auto",
    //transform: "translateX(-50%) translateY(-50%)",
    backgroundImage: " linear-gradient(107deg, #004fe0 12%, #0037e0 81%)",
    /*  backgroundColor: "linear-gradient(107deg, #004fe0 12%, #0037e0 81%)", */

    backgroundRepeat: "no-repeat",
    position: "relative",
    backgroundSize: "cover",
  },
  section: {
    padding: "64px 20px",
    textAlign: "center",
  },
  title: {
    ...title,
    color: primaryForeground,
    marginBottom: "1rem",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
  },
  number: {
    ...title,
    fontSize: "80px",
    marginBottom: "0px",
    marginTop: "1rem",
    minHeight: "80px",
    textDecoration: "none",
  },
  ...imagesStyle,
  itemGrid: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  cardTitle,
  smallTitle: {
    color: "#6c757d",
  },
  description: {
    color: "#000",
  },
  justifyCenter: {
    justifyContent: "center !important",
  },
  socials: {
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px",
    color: "#999",
  },
  margin5: {
    margin: "5px",
  },
};

export default stepsStyle;
