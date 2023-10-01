const jwt = require("jsonwebtoken");

// jwt verification middleware
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // if we don't have an authHeader or we have and authHeader and it doesn't start with capital Bearer return this status 
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401);
  }
  //getting just the token
  const token = authHeader.split(" ")[1];
  //   verifying the json web token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET, //this callback here has decoded information from the jwt
    (err, decoded) => {
      if (err) return res.sendStatus(403); //this means we received an invalid token. the status code is a forbidden status code.
      req.user = decoded.UserInfo.username;
      req.roles = decoded.UserInfo.roles
      next();
    }
  );
};
module.exports = verifyJWT;
