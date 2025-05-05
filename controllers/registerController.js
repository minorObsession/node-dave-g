const bcrypt = require("bcrypt");
const User = require("../model/User");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409); // 409 - conflict

  // ! no errors - create new user
  try {
    // create new user and hash the password (with salt rounds for extra security)
    const hashedPass = await bcrypt.hash(password, 10);

    // create and store newUser
    const result = await User.create({
      username: username,
      password: hashedPass,
    });

    /* // ! different way to create.. longer
    const newUser= new User()
    newUser.username = ....
    const result = await newUser.save()
    */
    console.log(result);

    res.status(201).json({ success: `New user ${username} created` });
  } catch (err) {
    res.sendStatus(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
