const express = require("express");
const db = require("../sqlconnection.js");
const { authentication } = require("../authentication.js");

let router = express.Router();
router.use(express.json());
router.use(authentication);

//	---------------- GET METHODS ---------------------
// GET All history
router.route("/").get((req, res) => {
  let start = req.query.start;
  let count = req.query.count;
  let total_table_entries = 0;

  if (req.query.start == undefined || req.query.count == undefined) {
    start = 0;
    count = 20;
  }
  let countQuery = `SELECT COUNT(*) FROM search_history`;
  let getAllQuery = `SELECT * FROM search_history LIMIT ${start},${count}`;
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

// GET History by uuid
router
  .route("/:uuid")
  .get((req, res) => {
    let start = req.query.start;
    let count = req.query.count;
    let total_table_entries = 0;

    if (req.query.start == undefined || req.query.count == undefined) {
      start = 0;
      count = 20;
    }
    let countQuery = `SELECT COUNT(*) FROM search_history WHERE (uuid = '${req.params.uuid}')`;
    let getAllQuery = `SELECT * FROM search_history WHERE (uuid = '${req.params.uuid}') LIMIT ${start},${count}`;
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
  })

  //	---------------- POST METHODS ---------------------
  .post((req, res) => {
    const insertHistoryQuery = `INSERT INTO search_history (judet, localitate, numar_cadastral, polygon_numar_cadastral, uuid) 
    VALUES (
        '${req.query.judet}', 
        '${req.query.localitate}', 
        '${req.query.numar_cadastral}',
        ST_PolygonFromText('POLYGON(${req.query.polygon})'), 
        '${req.params.uuid}')`;
    db.query(insertHistoryQuery, (err, results) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.sendStatus(200);
      }
    });
  });

module.exports = router;
