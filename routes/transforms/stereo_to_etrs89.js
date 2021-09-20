const express = require("express");
const polygis = require("polygis");
//44.435500, 26.102500 - Piata universitatii
let router = express.Router();
router.use(express.json());
const request_example = {
    coordinates: "552000.00, 322554.221; 552257.25, 324587.556",
    type: 70,
};
const response_example = {
    coordinates: [
        [46.44436784264511, 22.68845012463208],
        [46.44721101226258, 22.714805485068737],
    ],
    type: "etrs89",
};
//Stereo To ETRS89 descriptor object for pug
let descriptor = {
    title: "Stereo to ETRS89",
    method: "POST",
    description: "Transform from Stereo 70 or 30 into ETRS89 coordinates",
    link: "/transforms/stereo_to_etrs89",
    inputs: [
        {
            type: "textarea",
            placeholder: "500000.00, 500000.00;550000.00, 450000.00;",
        },
        {
            type: "select",
            options: ["Stereo 70", "Stereo 30"],
            label: "Stereo?",
        },
    ],
    req_example: JSON.stringify(request_example),
    res_example: JSON.stringify(response_example),
};

let parseCoordinateString = function (coordString, stereo30or70) {
    //coordString = coordString.replace("\n", "");
    console.log(coordString);
    let arrayOfPoints = coordString.split(";");
    stereo30or70 = parseInt(stereo30or70.replace("Stereo", ""));
    let arrayOfETRS89Points = [];
    arrayOfPoints.forEach((coord) => {
        let point = coord.split(",");

        if (point.length == 2) {
            let North = parseFloat(point[0].trim());
            let East = parseFloat(point[1].trim());
            arrayOfETRS89Points.push([
                polygis.ConvertStereoToETRS89(East, North, stereo30or70).phi,
                polygis.ConvertStereoToETRS89(East, North, stereo30or70).la,
            ]);
        }
    });
    return arrayOfETRS89Points;
};
router
    .route("/stereo_to_etrs89")
    .get((req, res) => {
        res.render("./pug/stereo_to_etrs89.pug", descriptor);
    })
    .post((req, res) => {
        if (!req.body) {
            res.sendStatus(400);
        }
        try {
            parseCoordinateString(req.body.coordinates, req.body.type);
            responseBody = {
                coordinates: parseCoordinateString(
                    req.body.coordinates,
                    req.body.type
                ),
                type: "etrs89",
            };
            res.status(200).send(responseBody);
        } catch (err) {
            res.status(400).send(err.message);
        }
    });

module.exports = router;
