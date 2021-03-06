const express = require("express");
const makerjs = require("makerjs");
const cors = require("cors");
const db = require("../sqlconnection.js");
const polygis = require("polygis");
let router = express.Router();
router.use(cors());
router.use(express.json());

ConstructGISData = function (pointsArray) {
    let stringOfSQLPolygon = "POLYGON((";
    pointsArray.forEach((p, i) => {
        let pointETRS89 = polygis.ConvertStereoToETRS89(p[0], p[1]);
        let pointString = `${pointETRS89.phi} ${pointETRS89.la}`;
        if (i < pointsArray.length && i > 0) {
            stringOfSQLPolygon += ",";
        }
        stringOfSQLPolygon += pointString;
    });
    stringOfSQLPolygon += "))";
    return stringOfSQLPolygon;
};

ConstructDXFFile = function (pointsArray) {
    try {
        var cadastral_points = new makerjs.models.ConnectTheDots(
            true,
            pointsArray
        );
        var model = {
            models: { cadastru: cadastral_points },
        };

        var dxf = makerjs.exporter.toDXF(model);

        return dxf;
    } catch (error) {
        return new Error(error.message);
    }
};

router.route("/").post((req, res) => {
    try {
        if (!req.body.points) {
            throw new Error("NO POINTS");
        }
        const dxf = ConstructDXFFile(req.body.points);
        const SQLPolygonString = ConstructGISData(req.body.points);
        const insertHistoryQuery = `INSERT INTO search_history (judet, localitate, numar_cadastral, polygon_numar_cadastral, uuid) 
  VALUES (
      '${req.body.judet_id}', 
      '${req.body.localitate_uat}', 
      '${req.body.numar_cadastral}',
      ST_PolygonFromText('${SQLPolygonString}'),
      '${req.body.uuid}')`;
        db.query(insertHistoryQuery, (err) => {
            if (err) {
                res.status(500).send(
                    "MySQL Error, please contact administrator."
                );
                return;
            }
            console.log("Inserted entry");
        });
        res.setHeader(
            "Content-disposition",
            "attachment; filename=" +
                `${req.body.numar_cadastral || "response"}.dxf`
        );
        res.setHeader("Content-Type", "application/dxf");
        res.status(200).send(dxf);
    } catch (error) {
        if (error.message != "OUTSIDE BORDER") {
            res.status(500).send(error.message);
        }
        console.log({ error });
        const dxf = ConstructDXFFile(req.body.points);
        res.setHeader(
            "Content-disposition",
            "attachment; filename=" +
                `${req.body.numar_cadastral || "response"}.dxf`
        );
        res.setHeader("Content-Type", "application/dxf");
        res.status(200).send(dxf);
    }
});

module.exports = router;
