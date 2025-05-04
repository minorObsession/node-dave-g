const usersDB = {
  users: require("../model/users.json"),
  setUsers(data) {
    this.users = data;
  },
};
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // on client (on front end) - also delete accessToken in the logout function!!!

  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // 204 - successfull - no content
  const refreshToken = cookies.jwt;

  // is refreshToken in db
  const foundUser = usersDB.users.find((u) => u.refreshToken === refreshToken);
  // if there's a cookie but no user is found
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true }, { maxAge: 24 * 60 * 60 * 1000 });

    return res.sendStatus(204); // 204 - success no content
  }

  // delete refresh token in db
  const otherUsers = usersDB.users.filter(
    (u) => u.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };

  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );

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
