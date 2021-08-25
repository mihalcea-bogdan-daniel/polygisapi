const express = require("express");
const http = require("http");
const makerjs = require("makerjs");


let router = express.Router();
router.use(express.json());

ConstructDXFFile = function (jsonData) {
    var line = { 
        type: 'line', 
        origin: [0, 0], 
        end: [50, 50] 
       };
    var pathObj = {myLine: line};
    var model = {paths:pathObj};
    
    var dxf = makerjs.exporter.toDXF(model)
    return dxf
};

var requestJSON = "";
callback = function (response, res) {
    requestJSON = "";
    response.on("data", function (chunk) {
        requestJSON += chunk;
        requestJSON = JSON.parse(requestJSON);
        var dxfFile = ConstructDXFFile();
        
        res.set("Content-disposition", `attachment; filename=dxf_file_maker.dxf`);
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
        callback(response, res);
    });
    httpReq.end();
});

module.exports = router;
