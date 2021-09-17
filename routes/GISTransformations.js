const { text } = require("body-parser");
const express = require("express");
const polygis = require("polygis");
//44.435500, 26.102500 - Piata universitatii
let router = express.Router();

//Stereo To ETRS89 descriptor object for pug
let descriptor = {
    title: "Stereo to ETRS89",
    method: "POST",
    description:
        "Returns ETRS89 coordinates, lat.############, lon.############",
    link: "/transformations/stereo_to_etrs89",
    inputs: [
        {
            type: "text",
            label: "North",
        },
        {
            type: "text",
            label: "East",
        },
        {
            type: "select",
            options: ["Stereo 70", "Stereo 30"],
            label: "Stereo?",
        },
    ],
};

router.route("/stereo_to_etrs89").get((req, res) => {
    res.render("stereo_to_etrs89", descriptor);
});
router.route("/stereo_to_etrs89").post((req, res) => {
    res.status(200).send(`Stereo 70  -> Etrs89 :`);
});
module.exports = router;
