const User = require("../model/User");

const handleLogout = async (req, res) => {
  // on client (on front end) - also delete accessToken in the logout function!!!

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // 204 - successfull - no content
  const refreshToken = cookies.jwt;

  // is refreshToken in db
  const foundUser = await User.findOne({ refreshToken }).exec();
  // if there's a cookie but no user is found
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true }, { maxAge: 24 * 60 * 60 * 1000 });

    return res.sendStatus(204); // 204 - success no content
  }

  // one way to delete refresh token
  // const result = await User.updateOne({ refreshToken: "" });

  // another way

  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  // clear cookie
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    // maxAge: 24 * 60 * 60 * 1000 // * maxAge can be omitted!,
  });

  res.sendStatus(204);
};

module.exports = { handleLogout };
