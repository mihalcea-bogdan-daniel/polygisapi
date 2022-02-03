require("dotenv").config();
const mysql = require("mysql");

var db = mysql.createPool({
    connectionLimit: 100,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
});

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log("MySQL connected");
// });

module.exports = db;
