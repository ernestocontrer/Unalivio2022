const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello");
});

const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`server are listening on ${host} and ${port}`);
});
