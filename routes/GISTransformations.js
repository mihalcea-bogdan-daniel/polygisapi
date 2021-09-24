const express = require("express");

const stereo_to_etrs89 = require("./transforms/stereo_to_etrs89");
const etrs89_to_stereo = require("./transforms/etrs89_to_stereo");

let router = express.Router();
router.use(express.json());
router.use(stereo_to_etrs89);
router.use(etrs89_to_stereo);

module.exports = router;
