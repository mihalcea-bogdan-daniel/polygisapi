const express = require("express");
const http = require("http");
const Drawing = require("dxf-writer");

let router = express.Router();
router.use(express.json());

ConstructDXFFile = function (jsonData) {
    let d = new Drawing();
    d.setUnits("Decimeters");
    d.drawText(10, 0, 10, 0, "polyGIS");
    d.addLayer("l_green", Drawing.ACI.GREEN, "CONTINUOUS");
    d.setActiveLayer("l_green");
    d.drawText(20, -70, 10, 0, "go green!");

    d.addLayer("polyLine", Drawing.ACI.BLUE, "CONTINUOUS");
    d.setActiveLayer("polyLine");
    d.drawPolyline(
        [
            [0, 0],
            [10, 10],
            [20, 10],
            [30, 0],
        ],
        true,
        1.5,
        1.5
    );

    return d.toDxfString();
};

var requestJSON = "";
callback = function (response, res) {
    requestJSON = "";
    response.on("data", function (chunk) {
        requestJSON += chunk;
        requestJSON = JSON.parse(requestJSON);
        dxf_file = ConstructDXFFile();
        res.set("Content-disposition", `attachment; filename=dxf_ile.dxf`);
        res.send(dxf_file);
    });
    response.on("end", function () {
        return;
    });
};

router.route("/").get((req, res) => {
    var options = {
        host: "geoportal.ancpi.ro",
        path: `/maps/rest/services/eterra3_publish/MapServer/1/query?f=json&where=INSPIRE_ID='RO.${req.body.judet_id}.${req.body.localitate_uat}.${req.body.numar_cadastral}'&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=NATIONAL_CADASTRAL_REFERENCE`,
        headers: {
            Origin: "http://geoportal.ancpi.ro",
            Referer: "https://geoportal.ancpi.ro/geoportal/imobile/Harta.html",
        },
    };
    var httpReq = http.request(options, (response) => {
        callback(response, res);
    });
    httpReq.end();
});

module.exports = router;
