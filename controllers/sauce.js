const Sauce = require('../models/Sauce');
const httpStatus = require('http-status');

/**
 * Get all hot sauces
 * @param { Express.Request } - req
 * @param { Express.Response } - res
 */

exports.getAllSauces = async (req, res) => {
  try {
    const getAllSauces = await Sauce.find();
    return res.status(httpStatus.OK).json(getAllSauces);
  } catch (error) {
      return res.status(httpStatus.BAD_REQUEST).json({ error })
  }
}

/**
 * Post hot sauces
 * @param { Express.Request } - req
 * @param { Express.Response } - res
 */

exports.postSauce = async (req, res) => {
  try {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      userLiked: [],
      userDisliked: []
    });
    const saveSauce = await sauce.save();
    return res.status(httpStatus.CREATED).json({ message: 'Object created' });
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error });
  }
}