//https://server275.web-hosting.com:2083

//Library requires
const express = require("express");

//Router requires
const stats = require("./routes/stats.js");
const history = require("./routes/history.js");
const validation = require("./routes/validation.js");
const app = express();

// Routes - Middlewares
app.use("/stats", stats);
app.use("/history", history);
app.use("/validation", validation);

//use the stats.js file to handle endpoints that start with stats

app.get("/", (req, res) => {
  res.send("PolyGIS API - By Arh. Mihalcea Bogdan Daniel");
});

app.listen(process.env.API_PORT);
