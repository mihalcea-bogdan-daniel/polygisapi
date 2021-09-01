const express = require("express");
const St70ETRS89 = require("../modules/Stereo70ToETRS89.js");
const {
    Interpolation1D,
    Interpolation2D,
} = require("../modules/Interpoliation1D.js");
let router = express.Router();
router.route("/stereo_to_etrs89").get((req, res) => {
    let tr = new St70ETRS89("Main");
    // let interp = new Interpolation2D(
    //     325544,
    //     522355,
    //     "ETRS89_KRASOVSCHI42_2DJ.GRD"
    // );
    tr.DoTransformation(325544, 522355, 70);
    interp.DoInterpolation();
    res.status(200).send("Stereo transformations will go here");
});
module.exports = router;
