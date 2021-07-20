const express = require("express");
const db = require("../sqlconnection.js");
const { authentication, is_polygis_usable } = require("../authentication.js");

let router = express.Router();
router.use(express.json());
router.use(authentication);
router.use(is_polygis_usable);

router
  .route("/")
  //	---------------- GET METHODS ---------------------
  .get((req, res) => {
    let query_string = `SELECT * FROM validation WHERE date = (SELECT MAX(date) from validation)`;
    db.query(query_string, (err, results) => {
      if (err) res.sendStatus(500);
      res.status(200).send(results);
    });
  });

module.exports = router;
