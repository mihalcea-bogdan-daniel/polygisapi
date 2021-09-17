//https://server275.web-hosting.com:2083

//Library requires
const express = require("express");
const path = require("path");
//Router requires
const stats = require("./routes/stats.js");
const history = require("./routes/history.js");
const validation = require("./routes/validation.js");
const dxf = require("./routes/dxf.js");
const GISTransformations = require("./routes/GISTransformations.js");
const app = express();

// Routes - Middlewares
app.use("/stats", stats);
app.use("/history", history);
app.use("/validation", validation);
app.use("/dxf", dxf);
app.use("/transforms", GISTransformations);
//Static webpage
app.use(express.static("views"));
app.use("/views", express.static("views"));
//Set renderer
app.set("view engine", "pug");
app.set("views", "./views/pug");

//use the stats.js file to handle endpoints that start with stats
app.get("/", (req, res) => {
    var options = { root: path.join(__dirname) };
    res.sendFile("views/index.html", options, function (err) {
        if (err) {
            res.send(err.message);
            return;
        }
    });
});

app.listen(process.env.API_PORT);
