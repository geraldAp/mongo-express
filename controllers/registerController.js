// bringing the user model
const User = require("../model/User");

const bcrypt = require("bcrypt");

// remember to mace this an async function
const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    res
      .status(400)
      .res.json({ message: `kindly provide a username or password` });
  // checking if the username that came in already exists in the data base
  const duplicate = await User.findOne({ username: username }).exec(); //the exec isn't always necessary it is helpful when you want to control when the data query is executed
  if (duplicate) {
    res
      // 409 status code means conflict
      .status(409)
      .json({
        message: `${username} already exists login or signup with different username `,
      });
    return;
  }
  // try and catch block
  try {
    //encrypt the password with bcrypt
    const saltRounds = 10; // to encrypt every password with random combinations the higher the salt value the harder it is to crack and the longer it takes to create the newly hashed password
    const hashedPwd = await bcrypt.hash(password, saltRounds); // takes to params the pwd and the salt round which is in here defaulted to 10
    // create an store the new user
    const result = await User.create({
      username: username,
      password: hashedPwd,
    });
    // // another way tho is  but the above creates every thing at once
    // const newUser = new User()
    // newUser.username = username
    //const result = await newUser.save()
    // or
    // const newUser = new User({
    // username: username,
    // password: hashedPwd,
    // })
    //const result = await newUser.save()

    console.log(result);

    res
      .status(201)
      .json({ message: `user ${username} has been created successfully!!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
