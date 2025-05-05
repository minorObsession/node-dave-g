const usersDB = {
  users: require("../model/users.json"),
  setUsers(data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  const foundUser = usersDB.users.find((u) => u.username === username);
  if (!foundUser) return res.sendStatus(401); // 401 - unauthorized

  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    const roles = Object.values(foundUser.roles);

    // create and pass on JWTs
    const accessToken = jwt.sign(
      // add roles to accessToken
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    // no need to send roles thru refresh token (it only exists to get a new access token)
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // saving refresh token with current user (in 'database')
    const otherUsers = usersDB.users.filter(
      (u) => u.username !== foundUser.username
    );
    const currentUser = {
      ...foundUser,
      refreshToken,
    };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    // refresh token as http only cookie - more secure!
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "None", //  to get rid of the flag
      // secure: true, // ! should be set to true in production!! in dev -> if true, refresh won't work in thunderClient!
    });
    // sending access token to the front end in json format
    // to be stored in memory on the frontend
    res.json({ accessToken });
  } else res.sendStatus(401);
};

module.exports = { handleLogin };
