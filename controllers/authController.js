// bringing the user model
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  // we can do further validations but for now
  try {
    if (!username || !password)
      throw Error("kindly provide a username or password");
    // finding the user
    const user = await User.findOne({ username }).exec();
    if (!user)
      throw Error(
        "This user does not exist. Kindly provide a correct username"
      );
    // comparing the passwords if they match the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      // Grabbing the roles we put in our user json file
      const roles = Object.values(user.roles);
      // create JWTs
      //   defining the access token
      // the first thing we need to pass into the jwt is a payload eg the userinfo object with the roles an. never pass in sensitive data like passwords
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: user.username,
            roles: roles,
          },
        }, //second thing needed to create our access token is our secret
        process.env.ACCESS_TOKEN_SECRET, //then the time you will want this token to expire in production at least 5min
        { expiresIn: "300s" }
      );
      //   longer period
      const refreshToken = jwt.sign(
        {
          username: user.username,
        }, //second thing needed to create our access token is our secret
        process.env.REFRESH_TOKEN_SECRET, //then the time you will want this token to expire in production at least 10hours
        { expiresIn: "1d" }
      );
      // adding the refresh token
      user.refreshToken = refreshToken;
      const result = await user.save();
      console.log(result);
      //   sending the refresh token as an http only cookie
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None", //set to none since the front end app is on another host
        maxAge: 24 * 60 * 60 * 1000,
      });//secure : true for production
      //   sending the access token as json
      res.json({ accessToken });
    } else {
      throw Error("Incorrect password");
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { handleLogin };
