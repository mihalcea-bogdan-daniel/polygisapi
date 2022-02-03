const express = require("express");
const db = require("../sqlconnection.js");
let router = express.Router();
const cors = require("cors");
router.use(cors());
router.use(express.json());
router.post("/", (req, res, next) => {
    const query = `INSERT INTO cifru (raspunsuri)
                   VALUES (${db.escape(req.body.raspuns)})`;
    if (req.body == {}) next("Empty body");
    db.query(query, (err) => {
        if (err) next(err);
        if (req.body.raspuns.toLowerCase() == "cicada3301") {
            res.status(200).send("OK");
            return;
        }
        next(new Error("Incorect"));
    });
});

module.exports = router;
