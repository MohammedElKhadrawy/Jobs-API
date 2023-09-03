const jwt = require('jsonwebtoken');
require('dotenv').config();

const throwCustomError = require('../errors/custom-error');

module.exports = async (req, res, next) => {
  // check header
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throwCustomError('Unauthenticated, No token was attached!', 401);
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw error; // technical errors from jwt's side. Ex: jwt malformed.
  }
  // manage token-expired-like situations
  if (!decodedToken) {
    throwCustomError('Unauthenticated.', 401);
  }
  // attach the user to the job routes
  req.user = { userId: decodedToken.userId, name: decodedToken.name };
  next();
};
