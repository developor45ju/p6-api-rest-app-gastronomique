const argon2 = require('argon2');
const User = require('../models/User.js');
const httpStatus = require('http-status')

/**
 * Creates user
 * @param { Express.Request } req
 * @param { Express.Response } res
 * @returns 
 */
exports.signup = async (req, res) => {
  try {
    const hash = await argon2.hash(req.body.password);
    const user = new User({
      email: req.body.email,
      password: hash,
    }); 
    const saveUser = await user.save();

    return res
      .status(httpStatus.CREATED)
      .json({ message: 'User successfully created' });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.BAD_REQUEST).json({ message: error });
  }
};

