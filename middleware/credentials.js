const allowedOrigins = require("../config/allowedOrigins");
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    // this is done for the frontend for cors not to give an error when taking the cookies 
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports= credentials