const express = require("express");
const db = require("../sqlconnection.js");
const authentication = require("../authentication.js");
let router = express.Router();
router.use(express.json());
router.use(authentication);

//	---------------- GET METHODS ---------------------
//GET stats start - starting entry number, count - number of entries to show
router.route("/").get((req, res) => {
  let start = req.query.start;
  let count = req.query.count;
  let total_table_entries = 0;

  if (req.query.start == undefined || req.query.count == undefined) {
    start = 0;
    count = 20;
  }
  let countQuery = `SELECT COUNT(*) FROM stats`;
  let getAllQuery = `SELECT * FROM stats LIMIT ${start},${count}`;
  db.query(countQuery, (err, results) => {
    if (err) res.status(500).send(err.message);
    total_table_entries = results[0]["COUNT(*)"];
  });

  db.query(getAllQuery, (err, results) => {
    if (err) res.status(500).send(err.message);
    let obj = {
      content: results,
      total_table_entries: total_table_entries,
    };
    res.status(200).send(obj);
  });
});

//GET stats by UUID
router.route("/:uuid").get((req, res) => {
  const getAllQuery = `SELECT * FROM stats WHERE uuid='${req.params.uuid}'`;
  db.query(getAllQuery, (err, results) => {
    if (err) res.status(500).send(err.message);
    res.status(200).send(results);
  });
});

//	---------------- POST METHODS ---------------------
router.route("/:uuid").post((req, res) => {
  let search_count,
    donation_count = 0;
  if (req.query.increment_column == "search_count") search_count = 1;
  if (req.query.increment_column == "donation_count") donation_count = 1;
  const query = `INSERT INTO stats (uuid, search_count, donation_count, is_ok)
	 VALUES ('${req.params.uuid}', '${search_count}', '${donation_count}', 1)
	 ON DUPLICATE KEY UPDATE ${req.query.increment_column} = ${req.query.increment_column} + 1`;

  db.query(query, (err, results) => {
    if (err) res.status(500).send(err.message);
    res.sendStatus(200);
  });
});

module.exports = router;
