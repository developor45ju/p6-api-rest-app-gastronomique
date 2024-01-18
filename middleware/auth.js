require('dotenv').config();

const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId
        }
        /*
        if (req.auth.userId !== req.body.userId) {
            console.log(req.auth.userId, ' ≠ ', req.body.userId);
            throw new Error('L\'utisateur est introuvable');
        }
        */
        next();
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ error: error?.message });
    }
}
