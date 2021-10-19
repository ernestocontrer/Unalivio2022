import React from "react";
import Iframe from "react-iframe-click";
import productClasses from "./Button123Pago.module.css";

function Button123Pago(props) {
  return (
    <div
      className={[productClasses.pagoButton, productClasses.bounce].join(" ")}
    >
      <Iframe
        srcdoc={props.data}
        width="210px"
        height="110px"
        scrolling="no"
        className={productClasses.iframe}
        style={{
          /*      display: "none", */
          border: "none",
        }}
        onInferredClick={() => {
          console.log("zzzzzzzz");
        }}
      ></Iframe>
    </div>
  );
}

export default Button123Pago;
