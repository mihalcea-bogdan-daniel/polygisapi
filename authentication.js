require("dotenv").config();
let db = require("./sqlconnection");

exports.authentication = function (req, res, next) {
  if (req.headers.Authorization == process.env.AUTH_KEY) {
    next();
  } else {
    res.sendStatus(403);
  }
};

exports.is_polygis_usable = function (req, res, next) {
  if (
    process.env.POLYGIS_ADDON_USABLE == "true" ||
    req.body.uuid == process.env.POLYGIS_ADMIN_UUID
  ) {
    next();
  } else {
    res
      .status(403)
      .send(
        "EROARE - Acces restricitionat, va rugam contactati admininstratorul."
      );
  }
};
