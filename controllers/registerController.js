const usersDB = {
  users: require("../model/users.json"),
  setUsers(data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  // check for duplicate usernames in the db
  const duplicate = usersDB.users.find((user) => user.username === username);

  if (duplicate) return res.sendStatus(409); // 409 - conflict

  // ! no errors - create new user
  try {
    // create new user and hash the password (with salt rounds for extra security)
    const hashedPass = await bcrypt.hash(password, 10);

    const newUser = { username: username, password: hashedPass };

    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );

    res.sendStatus(201).json({ success: `New user ${username} created` });
  } catch (err) {
    res.sendStatus(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
