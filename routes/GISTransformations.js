const express = require("express");

let router = express.Router();
router.route("/stereo_to_etrs89").get((req, res) => {
    res.status(200).send(`Stereo 70  -> Etrs89 :`);
});
module.exports = router;
