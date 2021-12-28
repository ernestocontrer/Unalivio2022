import {
  cardTitle,
  title,
  primaryColor,
  secondaryForeground,
  defaultFont,
} from "assets/jss/material-kit-react.jsx";
import imagesStyle from "assets/jss/material-kit-react/imagesStyles.jsx";

const encryptionStyle = {
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
    backgroundImage: "url(/seguridad.png)",
    backgroundColor: primaryColor,
    backgroundRepeat: "no-repeat",
    position: "relative",
    backgroundSize: "cover",
  },
  section: {
    padding: "64px 20px",
    minHeight: "600px",
    display: "flex",
    alignItems: "center",
    verticalAlign: "middle",
  },
  title: {
    ...title,
    color: secondaryForeground,
    marginBottom: "1rem",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
    position: "center",
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
    ...defaultFont,
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

export default encryptionStyle;
