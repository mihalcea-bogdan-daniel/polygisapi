const express = require("express");
const http = require("http");
const makerjs = require("makerjs");
const db = require("../sqlconnection.js");
let router = express.Router();
router.use(express.json());

ConstructDXFFile = function (jsonData) {
    try {
        points = jsonData["features"][0]["geometry"]["rings"][0];
        var cadastral_points = new makerjs.models.ConnectTheDots(true, points);
        var model = {
            models: { cadastru: cadastral_points },
        };

        var dxf = makerjs.exporter.toDXF(model);

        return dxf;
    } catch (error) {
        return error;
    }
};

var requestJSON = "";
callback = function (
    response,
    req,
    res,
    denumire_judet,
    denumire_localitate,
    numar_cadastral
) {
    requestJSON = "";
    response.on("data", function (chunk) {
        requestJSON += chunk;
        requestJSON = JSON.parse(requestJSON);
        try {
            points = requestJSON["features"][0]["geometry"]["rings"][0];
            var cadastral_points = new makerjs.models.ConnectTheDots(
                true,
                points
            );
            var model = {
                models: { cadastru: cadastral_points },
            };
            var dxf = makerjs.exporter.toDXF(model);
            res.set(
                "Content-disposition",
                `attachment; filename=${denumire_judet}-${denumire_localitate}-${numar_cadastral}.dxf`
            );

            const insertHistoryQuery = `INSERT INTO search_history (judet, localitate, numar_cadastral, uuid) 
  VALUES (
      '${req.body.judet_id}', 
      '${req.body.localitate_uat}', 
      '${req.body.numar_cadastral}',
      'api.polygis.xyz-not_required_uuid')`;
            db.query(insertHistoryQuery, (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Inserted scuccessfully!");
                }
            });

            res.status(200).send(dxf);
        } catch (error) {
            res.status(500).send(error.message);
        }
    });
    response.on("end", function () {
        return;
    });
};

router.route("/").post((req, res) => {
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
            req,
            res,
            req.body.denumire_judet,
            req.body.denumire_localitate,
            req.body.numar_cadastral
        );
    });
    httpReq.end();
});

module.exports = router;
