const express = require("express");
const db = require("../sqlconnection.js");
const { authentication, is_polygis_usable } = require("../authentication.js");

let router = express.Router();
router.use(express.json());
router.use(authentication);
router.use(is_polygis_usable);

//TODO Check double sent headers errors ... 2 times

router
  .route("/")
  //	---------------- GET METHODS ---------------------
  .get((req, res) => {
    let is_ok = 1;
    let body = req.body;
    //IF body in the request send an error
    if (body == undefined) {
      res.status(400).send("Check the requests body.");
      return;
    }
    if (body.uuid == undefined) {
      res.status(400).send('Check if body request contains "uuid" parameter.');
      return;
    }

    db.query(
      `SELECT is_ok FROM stats WHERE (uuid = '${req.body.uuid}')`,
      (err, results) => {
        if (err) {
          res.status(500).send(err.message);
          return;
        }
        try {
          if (results[0] == undefined || results == undefined) {
            let insertQuery = `INSERT INTO stats (uuid, search_count, donation_count, is_ok)
              VALUES ('${req.body.uuid}', '0', '0', 1)`;
            db.query(insertQuery, (err) => {
              if (err) {
                res.status(500).send(err.message);
                return;
              } else {
                res.sendStatus(202);
                return;
              }
            });
          } else if (results[0]["is_ok"] == 0) {
            res
              .status(403)
              .send(
                "EROARE - Acces restricitionat, va rugam contactati admininstratorul."
              );
            return;
          } else {
            let query_string = `SELECT id,version,mandatory_update,update_link FROM validation WHERE date = (SELECT MAX(date) from validation)`;
            db.query(query_string, (err, results) => {
              if (err) {
                res.sendStatus(500);
                return;
              }
              if (
                req.body.version != process.env.POLYGIS_FREE_VERSION &&
                req.body.version != results[0]["version"]
              ) {
                res
                  .status(426)
                  .send(
                    `Este necesara actualizarea AddOn-ului\ndescararea este posibila de la acest link ${results[0]["update_link"]}`
                  );
                return;
              } else {
                res.sendStatus(202);
              }
            });
          }
        } catch (error) {
          res.status(500).send(error.message);
          return;
        }
      }
    );
  });

module.exports = router;
