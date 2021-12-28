import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import { Button } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import LoadingButton from "@mui/lab/LoadingButton";
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
import axios from "axios-https-proxy-fix";
import { withFirebase } from "components/FirebaseProvider/FirebaseProvider.jsx";

const AdminPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("formateRequest");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post("https://us-central1-aliviame-mvp.cloudfunctions.net/exportExcel", {
        data: { email: email, password: password },
      })
      .then((responce) => {
        setEmail("");
        setPassword("");
        if (responce.data.email !== "") {
          if (responce.data.result === false) {
            alert("Invalid email or password!Try again");
            setLoading(false);
          } else {
            setTimeout(() => {
              setMode("goToEmail");
              setLoading(false);
            }, 5000);
          }
        }
      });
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
          {mode === "formateRequest" ? (
            <LoadingButton
              loadingPosition="start"
              style={{
                width: "380px",
                height: "50px",
                borderRadius: "30px",
                backgroundColor: "#0a7aff",
                color: "white",
              }}
              type="submit"
              variant="contained"
              loading={loading}
            >
              Confirm
            </LoadingButton>
          ) : (
            <Button
              href={"https://mail.google.com/mail/"}
              target="_blank"
              color="secondary"
              size="lg"
              rel="noopener noreferrer"
              round
              style={{
                width: "380px",
                height: "50px",
                borderRadius: "30px",
                backgroundColor: "green",
                color: "white",
              }}
            >
              Check email
            </Button>
          )}
        </form>
      </center>
    </>
  );
};

export default withStyles(landingPageStyle)(withFirebase(AdminPage));
