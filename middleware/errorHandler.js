const { logEvents } = require("./logEvents");

const errorhandler = function (err, req, res, next) {
    // logging the type of error into a file 
  logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);
  res.status(500).send(err.message);
};

module.exports = errorhandler;
