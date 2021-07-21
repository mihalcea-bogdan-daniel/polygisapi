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
    let is_ok = 1;
    //IF body in the request send an error
    if (req.body == undefine) {
      res.sendStatus(400);
    }

    db.query(
      `SELECT is_ok FROM stats WHERE (uuid = '${req.body.uuid}')`,
      (err, results) => {
        console.log(results[0]["is_ok"]);
        is_ok = results[0]["is_ok"];
        if (is_ok == 0) {
          res
            .status(403)
            .send(
              "EROARE - Acces restricitionat, va rugam contactati admininstratorul."
            );
        }
      }
    );

    let query_string = `SELECT id,version,mandatory_update,update_link FROM validation WHERE date = (SELECT MAX(date) from validation)`;
    db.query(query_string, (err, results) => {
      if (err) res.sendStatus(500);
      res.status(200).send(results);
    });
  });

module.exports = router;
