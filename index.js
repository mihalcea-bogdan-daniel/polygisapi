//https://server275.web-hosting.com:2083

const express = require("express");

const db = require("./sqlconnection.js");

const app = express();
// Routes - Middlewares
const stats = require("./routes/stats.js");

app.use("/stats", stats);
//use the stats.js file to handle endpoints that start with stats

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/db", (req, res) => {
  db.query("SELECT * FROM stats", (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
