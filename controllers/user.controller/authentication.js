const { sign } = require('jsonwebtoken');

const { hash, compare } = require('bcryptjs');

const user = require('../../models/schema/user.schema');

const signUp = async (req, res) => {
  try {
    let { username, password, email } = req.body;
    // TODO check validation password, email (unique), username (unique)
    if (!username || !password || !email)
      return res.status(400).send({ message: 'plz check form' });
    // const isUsername = user.findOne({ username });
    // const isEmail = user.findOne({ email });
    const [isUsername, isEmail] = await Promise.all([
      user.findOne({ username }),
      user.findOne({ email }),
    ]);
    if (isUsername) return res.status(400).send({ message: 'username exists' }); // username (unique)
    if (isEmail) return res.status(400).send({ message: 'email exists' }); // email (unique)
    // TODO create acc
    const signupAcc = await user.create({ username, password, email });
    signupAcc && res.send({ message: `${username} is created` });
  } catch (error) {
    // console.log(error)
    res.status(400).send({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    // console.log(req.body)
    let { username, password } = req.body;
    // TODO check username is valid
    const isUsername = await user.findOne({ username });

    if (!isUsername)
      return res.status(400).send({ message: 'username is not exist' });
    // TODO check password
    const checkPassword = await compare(password, isUsername.password);
    if (!checkPassword)
      return res.status(400).send({ message: 'wrong password' });
    // TODO sign In and return token
    const token = sign(
      {
        username: isUsername.username,
        email: isUsername.email,
      },
      process.env.SECRET_TOKEN,
      { expiresIn: '80h' },
    );
    res.send({
      signin: true,
      token,
      username,
      id: isUsername._id,
    });
  } catch (error) {
    // console.log(error)
    res.status(400).send({ message: error.message });
  }
};
module.exports = {
  signUp,
  signIn,
};
