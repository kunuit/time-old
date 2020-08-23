const { verify } = require('jsonwebtoken');
const User = require('../models/schema/user.schema');

module.exports = async (req, res, next) => {
  try {
    if (!req.headers.authorization)
      return res.status(400).send({ message: 'Token invalid' });
    const token = req.headers.authorization.split(' ')[1];
    const decode = await verify(token, process.env.SECRET_TOKEN);
    const { username } = decode;
    const existUser = await User.findOne({ username });
    !existUser && res.status(400).send({ message: 'Token invalid' });
    req.user = {
      idUser: existUser._id,
      username: existUser.username,
      email: existUser.email,
    };
    next();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: 'Verify token error' });
  }
};
