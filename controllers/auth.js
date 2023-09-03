const User = require('../models/User');
const collectValidationResult = require('../helpers/collectValidationResult');
const throwCustomError = require('../errors/custom-error');

exports.register = async (req, res, next) => {
  collectValidationResult(req);
  // we manage password encryption and token generation in the model to keep the controller lean
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(201)
    .json({ message: 'User created!', token, user: { name: user.name } });
};

exports.login = async (req, res, next) => {
  collectValidationResult(req);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throwCustomError('Could not find a user with this E-mail.', 401);
  }
  const isPasswordCorrect = await user.checkPassword(password);
  if (!isPasswordCorrect) {
    throwCustomError('Wrong password!', 401);
  }
  const token = user.createJWT();
  res.status(200).json({ token, user: { name: user.name } });
};
