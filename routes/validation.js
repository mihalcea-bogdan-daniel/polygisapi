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
      res.status(400).send('Check the requests body.');
    }else if (body.uuid == undefined) {
      res.status(400).send('Check if body request contains UUID parameter.');
    } else {
      db.query(
        `SELECT is_ok FROM stats WHERE (uuid = '${req.body.uuid}')`,
        (err, results) => {
          if (err) res.status(500).send(err.message);
          is_ok = results[0]["is_ok"];
          //IF users is_ok == 0 than deny access
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
        console.log(results);
        
        res.sendStatus(200);
      });
    }

  });

module.exports = router;
