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
    // [{imageUrl}, {imageUrl}]
    // getAllSauces.imageUrl = "free100Mo.JPG1703240525241.jpg"
    // faire une boucle des sauces
    // Créer une constante qui stock le nom de l'image
    // Créer une  
    // getAllSauces.imageUrl = "http://localhost:3000/images/free100Mo.JPG1703240525241.jpg"
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
      usersLiked: [],
      usersDisliked: []
    });
    
    await sauce.save();
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
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {
      ...req.body
    }
    delete sauceObject.userId;
    const sauce = await Sauce.findOne({ _id: req.params.id });
    if (req.file) {
      const imageFile = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${imageFile}`, (error) => {
        if (error) throw error;
      })
      await Sauce.updateOne({ _id: req.params.id }, { _id: req.params.id, ...sauceObject });
      return res.status(httpStatus.OK).json({ message : 'Sauce updated!' });  
    } else {
      await Sauce.updateOne({ _id: req.params.id }, { _id: req.params.id, ...sauceObject });
      return res.status(httpStatus.OK).json({ message : 'Sauce updated!' });  
    }
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error });
  }
}

/**
 * Delete a sauce
 * @param { Express.Request } - req
 * @param { Express.Response } - res
 */

exports.deleteSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    if (!sauce) return res.status(httpStatus.NOT_FOUND).json({message: 'Cette sauce n\'existe pas'})

    const imageFile = sauce.imageUrl.split('/images/')[1];
    fs.unlink(`images/${imageFile}`, (error) => {
      if (error) throw error;
    });
    await Sauce.deleteOne({ _id: req.params.id });
    return res.status(httpStatus.OK).json({ message: 'Delete successfully!' });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
}

exports.likeSauce = async (req, res) => {
  try {
    const like = req.body.like;
    const sauce = await Sauce.findOne({ _id: req.params.id });
    const userId = req.auth.userId;
    const userNote = {
      likes: 0,
      dislikes: 0,
      usersLiked: sauce.usersLiked,
      usersDisliked: sauce.usersDisliked
    }
    switch (like) {
      case 1:
        userNote.usersLiked.push(userId);
        break;
      case -1:
        userNote.usersDisliked.push(userId);
        break;
      default :
        if (userNote.usersLiked.includes(userId)) {
          const index = userNote.usersLiked.indexOf(userId);
          userNote.usersLiked.splice(index, 1);
        } else {
          const index = userNote.usersDisliked.indexOf(userId);
          userNote.usersDisliked.splice(index, 1);
        }
    }

    
    userNote.likes = userNote.usersLiked.length;
    userNote.dislikes = userNote.usersDisliked.length;
    console.log(userNote);
    await Sauce.updateOne({ _id: req.params.id }, userNote);
    return res.status(httpStatus.OK).json({ message: 'Sauce noted!' });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error });
  }
}