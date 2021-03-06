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
const APIDocumentation = require("./routes/apidocs.js");
const Cifru = require("./routes/cifru.js");
const app = express();
app.set("view engine", "pug");
// Routes - Middlewares
app.use("/docs", APIDocumentation);
app.use("/stats", stats);
app.use("/history", history);
app.use("/validation", validation);
app.use("/dxf", dxf);
app.use("/transforms", GISTransformations);
//Static webpage
app.use(express.static("views"));
app.use("/views", express.static("views"));
//Set renderer

/* ===================== | 'RARES - Cifru Cicada' | ===================== */
app.use("/cifru", Cifru);
/* ===================== | 'RARES - Cifru Cicada' | ===================== */

app.set("views", path.join(__dirname, "/views"));
app.set("js", path.join(__dirname, "/views/pug/js"));

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

app.use(function (err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).send("Incorect");
});

app.listen(process.env.API_PORT);
