// bringing the user model
const User = require("../model/User");
const handleLogout = async (req, res) => {
  // getting the cookie
  const cookies = req.cookies;
  // On client also delete the access token
  if (!cookies?.jwt) return res.sendStatus(204); // no content (successful)
  const refreshToken = cookies.jwt;
  // checking to see if refresh token is in the db
  const user = await User.findOne({ refreshToken }).exec();
  if (!user) {
    // so basically even we don't have a found user but we have a cookie to get to this point we clear the cookie this should also have the same options you used to create the refresh token
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", });
    return res.status(204).json({ message: `forbidden` }); //forbidden
  }
  // delete the refresh token in the data base
  user.refreshToken = "";
  //updating our user db / saving the changes made
  const result = await user.save();
  console.log(result);
  res.clearCookie("jwt", { httpOnly: true }); //in production add the flag secure: true - only serve on https
  res.status(204).json({ message: `logout successful` });
};
// adpList
module.exports = { handleLogout };
