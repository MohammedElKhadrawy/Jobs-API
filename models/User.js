const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // this creates a unique index only [WHICH IS NOT A VALIDATOR].
  },
  password: {
    type: String,
    required: true,
  },
});

// we have to use the good old function keyword to reserve "this" to refer to the document itself
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  // next() // we don't need to call next here, cuz working with async/await works the same way! [DOCS]
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFESPAN,
    }
  );
};

userSchema.methods.checkPassword = async function (enteredPassword) {
  const doesMatch = await bcrypt.compare(enteredPassword, this.password);
  return doesMatch;
};

module.exports = model('User', userSchema);
