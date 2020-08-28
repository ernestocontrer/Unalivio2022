import { title, subtitle, primaryColor, secondaryColor, grayColor } from "assets/jss/material-kit-react.jsx";

const productStyle = {
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
    backgroundImage: "url(/recarga.jpg)",
    backgroundColor: primaryColor,
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    backgroundSize: "cover"
  },
  section: {
    padding: "64px 40px",
    textAlign: "center"
  },
  title: {
    ...title,
    marginBottom: "1rem",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  },
  subtitle: {
    ...subtitle,
    marginBottom: "1rem",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none",
    color: primaryColor
  },
  description: {
    color: grayColor
  },
  form: {
    minHeight: "600px"
  }
};

export default productStyle;
