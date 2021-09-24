const express = require("express");

const swaggerUi = require("swagger-ui-express");
const swaggerDocumentation = require("../views/docs/polygis-docs.json");

let router = express.Router();
router.use(express.json());

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocumentation, { explorer: true }));

module.exports = router;
