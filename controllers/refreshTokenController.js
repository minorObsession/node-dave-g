const usersDB = {
  users: require("../model/users.json"),
  setUsers(data) {
    this.users = data;
  },
};
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, res) => {
  // get the cookie
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  // match user with this refresh token from the cookie
  const foundUser = usersDB.users.find((u) => u.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403); // 403 - forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);

    const roles = Object.values(foundUser.roles);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    // return new accessToken
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
