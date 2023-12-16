const mongoose = require('mongoose');
const strRgx = /[A-Za-z\-\_]{5,18}/
const strErrorMsg = 'Nous acceptons les lettres suivantes : a à z, -, _, de 5 à 18 caractères';

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    userLiked: { type: [String], default: [] },
    userDisliked: { type: [String], default: [] },
});

module.exports = mongoose.model('Sauce', sauceSchema);