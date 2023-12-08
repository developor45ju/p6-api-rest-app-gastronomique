const Hotsauce = require('../models/Hotsauce');
const httpStatus = require('http-status');

/**
 * Get all hot sauces
 * @param { Express.Request } - req
 * @param { Express.Response } - res
 */

exports.getAllHotsauces = async (req, res) => {
    try {
        const getAllHotsauces = await Hotsauce.find();
        console.log(getAllHotsauces);
        return res.status(httpStatus.OK).json(getAllHotsauces);
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).json({ error })
    }
}