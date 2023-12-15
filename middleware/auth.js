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
        next();
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ error });
    }
}
