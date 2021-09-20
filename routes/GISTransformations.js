const express = require("express");
const polygis = require("polygis");

const bodyParser = require("body-parser");

//https://blog.logrocket.com/documenting-your-express-api-with-swagger/
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = require("../views/docs/basicInfo");
const specs = swaggerJsdoc(options);

const stereo_to_etrs89 = require("./transforms/stereo_to_etrs89");
const etrs89_to_stereo = require("./transforms/etrs89_to_stereo");
//44.435500, 26.102500 - Piata universitatii
let router = express.Router();
router.use(express.json());
router.use(stereo_to_etrs89);
router.use(etrs89_to_stereo);
router.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

module.exports = router;
