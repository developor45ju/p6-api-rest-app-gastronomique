require('dotenv').config();

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
    
    getAllSauces.forEach(sauce => {
      sauce.imageUrl = `${req.protocol}://${req.get('host')}/${process.env.FOLDER_IMAGES}/${sauce.imageUrl}`;
    });
    return res.status(httpStatus.OK).json(getAllSauces);
  } catch (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: error?.message })
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
      imageUrl: req.file.filename,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });

    await sauce.save();

    return res.status(httpStatus.CREATED).json({ message: 'Object created' });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {
        console.log('Image deleted with success');
      });
    }
    console.log(error)
    return res.status(httpStatus.BAD_REQUEST).json({ error: error?.message });
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
    getOneSauce.imageUrl = `${req.protocol}://${req.get('host')}/${process.env.FOLDER_IMAGES}/${getOneSauce.imageUrl}`;
    return res.status(httpStatus.OK).json(getOneSauce);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).json({ error: error?.message });
  }
}

/**
 * Update a sauce
 * @param { Express.Request } - req
 * @param { Express.Response } - res
 */

exports.updateSauce = async (req, res) => {
  try {
    const newSauce = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: req.file.filename,
        }
      : {
          ...req.body,
        };
    delete newSauce.userId;
    await Sauce.findOne({ _id: req.params.id });
    if (req.file) {
      fs.unlink(req.file.path, (error) => {
        if (error) throw error;
      });
    }
     
    await Sauce.updateOne({ _id: req.params.id }, { _id: req.params.id, ...newSauce });
    return res.status(httpStatus.OK).json({ message : 'Sauce updated!' });  
    
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {
        console.log('Image not uploaded with success');
      });
    }
    return res.status(httpStatus.BAD_REQUEST).json({ error: error?.message });
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

    fs.unlink(`${process.env.FOLDER_IMAGES}/${sauce.imageUrl}`, (error) => {
      if (error) throw error;
    });
    await Sauce.deleteOne({ _id: req.params.id });
    return res.status(httpStatus.OK).json({ message: 'Delete successfully!' });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error?.message });
  }
}

exports.likeSauce = async (req, res) => {
  try {
    const like = req.body.like;
    if (req.auth.userId !== req.body.userId) {
      console.log(req.auth.userId, ' ≠ ', req.body.userId);
      throw new Error('Mauvais utilisateur');
    }
    const sauce = await Sauce.findOne({ _id: req.params.id });
    if (!sauce) throw new Error('Cette sauce n\'existe pas!');
    
    const userId = req.auth.userId;
    const userNote = {
      likes: sauce.likes,
      dislikes: sauce.dislikes,
      usersLiked: sauce.usersLiked, 
      usersDisliked: sauce.usersDisliked
    }

    const isEverLiked = userNote.usersLiked.includes(userId);
    const isEverDisliked = userNote.usersDisliked.includes(userId);
    const errorMessageUnauthorizedAction = 'Cette action n\'est pas autorisée!';
    
    switch (like) {
      case 1:
        if (isEverLiked) throw new Error(errorMessageUnauthorizedAction);
        userNote.usersLiked.push(userId);
        break;

      case -1:
        if (isEverDisliked) throw new Error(errorMessageUnauthorizedAction);
        userNote.usersDisliked.push(userId);
        break;

      case 0 :
        if (isEverLiked) {
          // remove user from usersLiked array
          const index = userNote.usersLiked.indexOf(userId);
          userNote.usersLiked.splice(index, 1);
        } else if (isEverDisliked) {
          // remove user from usersDisliked array
          const index = userNote.usersDisliked.indexOf(userId);
          userNote.usersDisliked.splice(index, 1);
        } else {
          throw new Error('La sauce n\'a pas été notée par cet utilisateur !');
        }
        break;

      default:
        throw new Error(errorMessageUnauthorizedAction); 
    }
    
    userNote.likes = userNote.usersLiked.length;
    userNote.dislikes = userNote.usersDisliked.length;
    await Sauce.updateOne({ _id: req.params.id }, userNote);
    return res.status(httpStatus.OK).json({ message: 'Sauce noted!' });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error?.message });
  }
}