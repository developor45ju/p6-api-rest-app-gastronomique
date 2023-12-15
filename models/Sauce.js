const mongoose = require('mongoose');
const strRgx = /[A-Za-z\-\_]{5,18}/
const strErrorMsg = 'Nous acceptons les lettres suivantes : a à z, -, _, de 5 à 18 caractères';

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true, match: [strRgx, strErrorMsg] },
    manufacturer: { type: String, required: true, match: [strRgx, strErrorMsg] },
    description: { type: String, required: true, match: [strRgx, strErrorMsg] },
    mainPepper: { type: String, required: true, match: [strRgx, strErrorMsg] },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    userLiked: { type: Array },
    userDisliked: { type: Array },
});

module.exports = mongoose.model('Hotsauces', sauceSchema)