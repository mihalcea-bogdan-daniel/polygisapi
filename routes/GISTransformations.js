const { text } = require("body-parser");
const express = require("express");
const polygis = require("polygis");
//44.435500, 26.102500 - Piata universitatii
let router = express.Router();
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

router.route("/stereo_to_etrs89").get((req, res) => {
    
    res.render("./pug/stereo_to_etrs89.pug", descriptor);
});
router.route("/stereo_to_etrs89").post((req, res) => {
    console.log(req.body);
    res.status(200).send(`${req.body}`);
});
module.exports = router;
