//https://server275.web-hosting.com:2083

//Library requires
const express = require("express");
const db = require("./sqlconnection.js");

//Router requires
const stats = require("./routes/stats.js");
const history = require("./routes/history.js");

const app = express();

// Routes - Middlewares
app.use("/stats", stats);
app.use("/history", history);
//use the stats.js file to handle endpoints that start with stats

app.get("/", (req, res) => {
  res.send("PolyGIS API - deployment check");
});

app.get("/db", (req, res) => {
  db.query("SELECT * FROM stats", (err, result) => {
    if (err) {
      res.status(100).send(err.message);
    }
    res.send(result);
  });
});

app.listen(process.env.API_PORT, (req, res) => {
  console.log(`Listening on port ${process.env.API_PORT}`);
});
