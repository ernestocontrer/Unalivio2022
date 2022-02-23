const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.post("/", (req, res) => {
  console.log("req.body", req.body);
  res.send("Hello World");
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`server are listening on ${host} and ${port}`);
});
