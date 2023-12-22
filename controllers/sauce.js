const fs = require('node:fs');
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

/**
 * Get one sauce
 * @param { Express.Request } - req
 * @param { Express.Response } - res
 */

exports.getOneSauce = async (req, res) => {
  try {
    const getOneSauce = await Sauce.findOne({ _id: req.params.id });
    return res.status(httpStatus.OK).json(getOneSauce);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).json({ error });
  }
}

/**
 * Update a sauce
 * @param { Express.Request } - req
 * @param { Express.Response } - res
 */

exports.updateSauce = async (req, res) => {
  try {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      userLiked: [],
      userDisliked: []
    } : {
      ...req.body,
      likes: 0,
      dislikes: 0,
      userLiked: [],
      userDisliked: []
    }
    delete sauceObject.userId;
    const sauce = await Sauce.findOne({ _id: req.params.id });
    if (req.file) {
      const imageFile = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${imageFile}`, (error) => {
        if (error) throw error;
      })
      const updateSauce = await Sauce.updateOne({ _id: req.params.id }, { _id: req.params.id, ...sauceObject });
      return res.status(httpStatus.OK).json({ message : 'Sauce updated!' });  
    } else {
      const updateSauce = await Sauce.updateOne({ _id: req.params.id }, { _id: req.params.id, ...sauceObject });
      return res.status(httpStatus.OK).json({ message : 'Sauce updatled!' });  
    }
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error });
  }
}