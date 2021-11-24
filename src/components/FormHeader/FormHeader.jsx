// import React from 'react';
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { AnchorLink } from "gatsby-plugin-anchor-links";
import { Button, Input } from "@material-ui/core";
import Classes from "./FormHeaderStyle.module.css";

export default function BasicSelect(props) {
  const [nameProduct, setNameProduct] = React.useState("");
  const names = [" Movistar ", " Digitel ", " Movilnet "];
  const { error, handlePhone, to, productName, inputSelections } = props;

  React.useEffect(() => {
    animation(0);
  }, []);

  const getNameArr = (array) => {
    let res = [];
    array.split("").reduce((accum, curr) => {
      res.push(accum + curr);
      return accum + curr;
    }, "");
    return res;
  };

  const animation = (index) => {
    index === 3 ? (index = 0) : (index = index);
    let nameArr = getNameArr(names[index]);
    let i = 0;

    let interval = setInterval(() => {
      setNameProduct(nameArr[i]);
      i++;
      if (i === nameArr.length) {
        clearInterval(interval);
        i = 0;
        nameArr = nameArr.reverse();
        interval = setInterval(() => {
          setNameProduct(nameArr[i]);
          i++;
          if (i === nameArr.length) {
            clearInterval(interval);
            return animation(index + 1);
          }
        }, 75);
      }
    }, 200);
  };

  return (
    <div
      className={Classes.container}
      style={{
        position: "absolute",
        bottom: "100%",
      }}
    >
      <div className={Classes.title}>
        Es muy fácil rápido y seguro recargar a tu celular{" "}
        <span className={Classes.span} style={{ color: "#ffd60a" }}>
          {nameProduct}
        </span>
      </div>
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            marginBottom: "7px",
          }}
        >
          Número a recargar
        </div>
        <div>
          <Box
            sx={{ "& > :not(style)": { width: "380px" } }}
            noValidate
            autoComplete="off"
            style={{
              margin: "0px",
              width: "380px",
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            <TextField
              value={to}
              onChange={handlePhone}
              error={error}
              id="outlined-basic"
              label="Número"
              /*   variant="outlined" */
            />
          </Box>
        </div>
      </div>

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            marginBottom: "7px",
          }}
        >
          Compañia{" "}
        </div>
        <div>
          <Box
            sx={{ "& > :not(style)": { width: "380px" } }}
            noValidate
            autoComplete="off"
            style={{
              color: "ffd60a",
              margin: "0px",
              width: "380px",
              backgroundColor: "white",
              borderRadius: "5px",
            }}
          >
            <TextField
              readOnly
              value={productName}
              error={error}
              id="outlined-basic"
              label="Compañia"
              variant="outlined"
            />
          </Box>
          <FormControl fullWidth>
            {/*   <InputLabel id="demo-simple-select-label">Compañia</InputLabel> */}
          </FormControl>
        </div>
      </div>
      <AnchorLink to="/#topup">
        <Button
          color="secondary"
          size="lg"
          onClick={() => {}}
          rel="noopener noreferrer"
          round
          style={{
            width: "380px",
            height: "50px",
            borderRadius: "30px",
            backgroundColor: "#ffd60a",
            color: "#0a7aff",
          }}
        >
          {" "}
          Recarga Ya
        </Button>
      </AnchorLink>
    </div>
  );
}
