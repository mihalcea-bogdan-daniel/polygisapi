const express = require("express");
const {
    StereoToETRS89,
    ETRS89ToStereo,
} = require("../modules/Stereo70ToETRS89.js");
let router = express.Router();
router.route("/stereo_to_etrs89").get((req, res) => {
    let tr = new StereoToETRS89("name");
    // let interp = new Interpolation2D(
    //     325544,
    //     522355,
    //     "ETRS89_KRASOVSCHI42_2DJ.GRD"
    // );
    tr.DoTransformation(585641, 345647, 70);
    let tre = new ETRS89ToStereo("name");
    tre.DoTransformation(46, 25, 70);
    res.status(200).send(
        `Stereo 70  -> Etrs89 \nN: ${tr.GetPhi}\nN: ${tre.GetLa}`
    );
});
module.exports = router;
