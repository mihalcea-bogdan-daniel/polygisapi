const express = require("express");
const makerjs = require("makerjs");
const cors = require("cors");
const db = require("../sqlconnection.js");
let router = express.Router();
var corsOptions = {
    origin: "https://geoportal.ancpi.ro",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
router.use(cors(corsOptions));
router.use(express.json());

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
        if (!req.body.numar_cadastral) {
            throw new Error("NO CADASTER FOUND");
        }
        const dxf = ConstructDXFFile(req.body.points);
        const insertHistoryQuery = `INSERT INTO search_history (judet, localitate, numar_cadastral, uuid) 
  VALUES (
      '${req.body.judet_id}', 
      '${req.body.localitate_uat}', 
      '${req.body.numar_cadastral}',
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
            "attachment; filename=" + `${req.body.numar_cadastral}.dxf`
        );
        res.status(200).send(dxf);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
