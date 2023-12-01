const argon2 = require('argon2');
const User = require('../models/User.js');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');

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

/**
 * Login user
 * @param { Express.Request } req 
 * @param { Express.Response } res 
 * @returns 
 */
exports.login = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) return res.status(httpStatus.UNAUTHORIZED).json({message: 'Wrong email/password'});
      
      const verifPassword = await argon2.verify(user.password, req.body.password);
      if (!verifPassword) return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Wrong email/password' });

      const userId = user._id;
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      return res.status(httpStatus.OK).json({ token, userId });
    }  catch(error) {
      console.log(error);
      return res.status(httpStatus.BAD_REQUEST).json({ message: error });
    }
}