// import React from 'react';
import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { AnchorLink } from "gatsby-plugin-anchor-links";
import { Button } from "@material-ui/core";
import Classes from "./FormHeaderStyle.module.css"


export default function BasicSelect(props) {
  const [age, setAge] = React.useState("");
  const { error, handlePhone, to, product, handleChange, inputSelections} = props;

  return (
    <div className={Classes.container} style={{
      position:'absolute',
      bottom:'100%'
    }}>
        <div className={Classes.title}>Es muy fácil rápido y seguro recargar a tu celular <span className={Classes.span}>Movistar</span></div>
      <div style={{
          marginBottom:'20px'
      }}>
        <div style={{
            marginBottom:'7px'
        }}>Número a recargar</div>
        <div>
          <Box
            component="form"
            sx={{ "& > :not(style)": {width: "380px" } }}
            noValidate
            autoComplete="off"
            style={
             {
                 margin:'0px',
                 width:'380px',
                 backgroundColor:'white',
                 borderRadius:'5px'
             } 
            }
          >
            <TextField
              value={to}
              onChange={handlePhone}
              error={error}
              id="outlined-basic"
              label="Número"
              variant="outlined"
            />
          </Box>
        </div>
      </div>

      <div style={{
          marginBottom:'20px'
      }}>
        <div style={{
            marginBottom:'7px'
        }}>Compañia </div>
        <div>
          <Box sx={{ minWidth: 120 }} style={{
              width:'380px',
              backgroundColor:'white',
              borderRadius:'5px'
          }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Compañia</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={product}
                label="Compañia"
                onChange={handleChange}
              >
                  {inputSelections.map((option, key) => (
                  <MenuItem value={option.value} key={key}>
                      {option.name}
                  </MenuItem> ))}
              </Select>
            </FormControl>
          </Box>
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
              width:'380px',
              height:'50px',
              borderRadius:'30px',
              backgroundColor:'#038DDA',
              color:'white'
          }}
        > Recarga Ya
        </Button>
      </AnchorLink>

    </div>
  );
}
