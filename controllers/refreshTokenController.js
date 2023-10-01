// bringing the user model
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  // getting the cookie
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  console.log(cookies.jwt);
  // putting the refresh token in a variable since we have confirmed we have it
  const refreshToken = cookies.jwt;
  // finding the user with the refresh token that matches this refresh token.
  const user = await User.findOne({refreshToken }).exec();
  if (!user) return res.sendStatus(401); //forbidden
  // evaluate jwt
  jwt.verify(
    // first the refreshToken
    refreshToken, //second the secret
    process.env.REFRESH_TOKEN_SECRET, //third an anonymous function
    (err, decoded) => {
      if (err || user.username !== decoded.username) {
        return res.sendStatus(403);
      }
      // getting the roles
      const roles = Object.values(user.roles)
      // if the refresh token has been verified we then go over to assign the access token to  send
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: decoded.username,
            roles: roles,
          },
        }, //second thing needed to create our access token is our secret
        process.env.ACCESS_TOKEN_SECRET, //then the time you will want this token to expire in production at least 5min
        { expiresIn: "30s" }
      );
      res.json({ accessToken });
    }
  );
};
// adpList
module.exports = { handleRefreshToken };
