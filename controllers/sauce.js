const sauce = require('../models/Sauce');
const httpStatus = require('http-status');

/**
 * Get all hot sauces
 * @param { Express.Request } - req
 * @param { Express.Response } - res
 */

exports.getAllSauces = async (req, res) => {
    try {
      // TODO : Vérifier si l'utilisateur est connecté => middleware
      // Récupérer toute les sauces piquante
      const getAllHotsauces = await sauce.find();
      console.log(getAllHotsauces);
      // Mettre le tableau des sauces piquante dans un fichier json
      return res.status(httpStatus.OK).json(getAllHotsauces);
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
      // TODO : Vérifier si l'utilisateur est connecté => middleware
      // TODO : Implémenter multer => middleware
      // Récupérer la sauce piquante du body
      // Sauvegarder la sauce dans la DB
      // Retourner une réponse JSON

      const sauce = req.body;
      console.log(typeof sauce);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ error })
    }
}