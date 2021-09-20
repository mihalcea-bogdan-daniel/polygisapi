const express = require("express");
const polygis = require("polygis");
//44.435500, 26.102500 - Piata universitatii
let router = express.Router();
router.use(express.json());
const request_example = {
    coordinates: "46.23146,25.546456; 45.564654, 24.578484;",
    type: 70,
};
const response_example = {
    coordinates: [
        [
            [525897.2724371311, 542263.2119023956],
            [451742.84225592745, 467221.3052638201],
        ],
    ],
    type: "Stereo 70",
};
//Stereo To ETRS89 descriptor object for pug
let descriptor = {
    title: "ETRS89 to Stereo",
    method: "POST",
    description: "Transform from ETRS89 to Stereo 70 coordinates",
    link: "/transforms/etrs89_to_stereo",
    inputs: [
        {
            type: "textarea",
            placeholder: "46.23146, 25.546456; 45.564654, 24.578484;",
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
            let phi = parseFloat(point[0].trim());
            let la = parseFloat(point[1].trim());
            let northEast = polygis.ConvertETRS89ToStereo70(phi, la);
            arrayOfETRS89Points.push([northEast.North, northEast.East]);
        }
    });
    return arrayOfETRS89Points;
};
router
    .route("/etrs89_to_stereo")
    .get((req, res) => {
        res.render("./pug/coordinates_transform.pug", descriptor);
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
