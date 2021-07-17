const express = require("express");
const db = require("../sqlconnection.js");
const bodyParser = require("body-parser");

let router = express.Router();
router.use(express.json());

//	---------------- GET METHODS ---------------------
//get all stats
router.route("/").get((req, res) => {
  getAll = "SELECT * FROM stats";
  db.query(getAll, (err, results) => {
    if (err) res.status(500).send(err.message);
    res.status(200).send(results);
  });
});

router.route("/:uuid").get((req, res) => {
  const getAllQuery = `SELECT * FROM stats WHERE uuid='${req.params.uuid}'`;
  db.query(getAllQuery, (err, results) => {
    if (err) res.status(500).send(err.message);
    res.status(200).send(results);
  });
});

//	---------------- POST METHODS ---------------------
router.route("/:uuid").post((req, res) => {
  const query = "SELECT * FROM stats WHERE uuid='" + req.params.uuid + "'";

  db.query(query, (err, results) => {
    if (err) res.status(500).send(err.message);

    if (results.length == 0) {
      const insertQuery = `INSERT INTO stats (uuid, search_count, donation_count, is_ok) VALUES ('${req.params.uuid}', '0', '0', '1')`;
      db.query(insertQuery, (err) => {
        if (err) res.status(500).send(err.message);
        res.sendStatus(200);
      });
    } else {
      console.log(req.query.p);
      let obj = JSON.parse(req.query.p);
      console.log("obj:", obj.coords);
      db.query(
        `UPDATE stats SET ${req.query.increment_column} = ${req.query.increment_column} + 1 WHERE stats.uuid = "${req.params.uuid}"`,
        (err) => {
          if (err) res.status(500).send(err.message);
        }
      );
      res.sendStatus(200);
    }
  });
});

module.exports = router;
