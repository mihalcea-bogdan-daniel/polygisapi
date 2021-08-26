const express = require("express");
const http = require("http");
const makerjs = require("makerjs");

let router = express.Router();
router.use(express.json());

ConstructDXFFile = function (jsonData) {
    points = jsonData["features"][0]["geometry"]["rings"][0];

    var cadastral_points = new makerjs.models.ConnectTheDots(true, points);
    var model = {
        models: { cadastru: cadastral_points },
    };

    var dxf = makerjs.exporter.toDXF(model);

    return dxf;
};

var requestJSON = "";
callback = function (
    response,
    res,
    denumire_judet,
    denumire_localitate,
    numar_cadastral
) {
    requestJSON = "";
    response.on("data", function (chunk) {
        requestJSON += chunk;
        requestJSON = JSON.parse(requestJSON);
        var dxfFile = ConstructDXFFile(requestJSON);

        res.set(
            "Content-disposition",
            `attachment; filename=${denumire_judet}-${denumire_localitate}-${numar_cadastral}.dxf`
        );

        res.send(dxfFile);
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
        callback(
            response,
            res,
            req.body.denumire_judet,
            req.body.denumire_localitate,
            req.body.numar_cadastral
        );
    });
    httpReq.end();
});

module.exports = router;
