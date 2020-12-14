import {
  grayColor,
  roseColor,
  primaryColor,
  secondaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  defaultFont
} from "assets/jss/material-kit-react.jsx";

const buttonStyle = {
  base: {
    //iconColor: '#c4f0ff',
    color: '#fff',
    fontWeight: 500,
    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
    fontSize: '16px',
    fontSmoothing: 'antialiased',
    ':-webkit-autofill': {
      color: '#fce883',
    },
    '::placeholder': {
      color: '#87bbfd',
    },
  },
  invalid: {
    iconColor: '#ffc7ee',
    color: '#ffc7ee',
  },
};

export default buttonStyle;
