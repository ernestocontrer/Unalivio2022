import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";

import TextField from "@mui/material/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import { Button } from "@material-ui/core";
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import orders from "../../services/orders";
import { withFirebase } from "components/FirebaseProvider/FirebaseProvider.jsx";

const AdminPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();

    orders(props.firebase).create({
      code: "ADMIN",
      from: email,
      password: password,
    });
    setEmail("");
    setPassword("");
    return;
  };
  return (
    <>
      <center style={{ marginTop: "100px" }}>
        <h1>AdminPage</h1>
        <form onSubmit={handleSubmit}>
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
              autoComplete="off"
              value={email}
              required
              id="outlined-basic"
              label="Email"
              onChange={(event) => {
                setEmail(event.currentTarget.value);
              }}
            />
          </Box>
          <br />
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
              autoComplete="off"
              value={password}
              required
              id="outlined-basic"
              label="Password"
              onChange={(event) => {
                setPassword(event.currentTarget.value);
              }}
            />
          </Box>
          <br />
          <Button
            type="submit"
            color="secondary"
            size="lg"
            onClick={() => {}}
            rel="noopener noreferrer"
            round
            style={{
              width: "380px",
              height: "50px",
              borderRadius: "30px",
              backgroundColor: "#0a7aff",
              color: "white",
            }}
          >
            {" "}
            Confirm
          </Button>
        </form>
      </center>
    </>
  );
};

export default withStyles(landingPageStyle)(withFirebase(AdminPage));
