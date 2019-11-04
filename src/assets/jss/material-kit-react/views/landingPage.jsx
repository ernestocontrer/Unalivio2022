import { container, title } from "assets/jss/material-kit-react.jsx";

const landingPageStyle = {
  background: {
    filter: "blur(2px) opacity(75%)",
    zIndex: -100,
    position: "fixed",
    top: "50%",
    left: "50%",
    minWidth: "100%",
    minHeight: "100%",
    width: "auto",
    height: "auto",
    transform: "translateX(-50%) translateY(-50%)",
    background: "url('/bg.jpg') no-repeat",
    backgroundSize: "cover",
    transition: "3s opacity",
  },
  container: {
    zIndex: "12",
    color: "#FFFFFF",
    ...container
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    color: "#3C4858",
    textDecoration: "none"
  },
  subtitle: {
    fontSize: "1.313rem",
    maxWidth: "500px",
    margin: "10px auto 0"
  },
  mainTransparent: {
    background: "#FFFFFF00",
    position: "relative",
    zIndex: "3"
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainRaised: {
    margin: "-60px 30px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  }
};

export default landingPageStyle;
