const express = require("express");
const polygis = require("polygis");
//44.435500, 26.102500 - Piata universitatii
let router = express.Router();
router.use(express.json());
req = {
    "coordinates": "552000.00, 322554.221; 552257.25, 3244587.556",
    "type": 70
}
res = {
    "coordinates": "45.550, 24.550; 43.548, 24.875",
    "type": "ETRS89"
}
//Stereo To ETRS89 descriptor object for pug
let descriptor = {
    title: "Stereo to ETRS89",
    method: "POST",
    description:
        "Transform from Stereo 70 or 30 into ETRS89 coordinates",
    link: "/transforms/stereo_to_etrs89",
    inputs: [
        {
            type: "textarea",
            placeholder: "500000.00, 500000.00;\n550000.00, 450000.00;",
        },
        {
            type: "select",
            options: ["Stereo 70", "Stereo 30"],
            label: "Stereo?",
        },
    ],
    req_example: JSON.stringify(req),
    res_example: JSON.stringify(res),
};

let parseCoordinateString = function (coordString, stereo30or70) {
    let arrayOfPoints = coordString.split(";")
    stereo30or70 = parseInt( stereo30or70.replace("Stereo", ""));
    let arrayOfETRS89Points = [];
    arrayOfPoints.forEach(coord => {
        let point = coord.split(",");

        if (point.length == 2) {
            let North = parseFloat(point[0].trim());
            let East = parseFloat(point[1].trim());
            console.log(`North: ${North} - East: ${East}`);
            arrayOfETRS89Points.push(
                [polygis.ConvertStereoToETRS89(East, North, stereo30or70).phi,
                 polygis.ConvertStereoToETRS89(East, North, stereo30or70).la]);
        }
    });
    return arrayOfETRS89Points;
}
router.route("/stereo_to_etrs89")
    .get((req, res) => {

        res.render("./pug/stereo_to_etrs89.pug", descriptor);
    })
    .post((req, res) => {
        body = JSON.stringify(req.body);
        console.log(body);
        if(!req.body){
            res.sendStatus(503);
        }

        parseCoordinateString(req.body.coordinates, req.body.type);

        res.status(200).send(body);
    });


module.exports = router;
