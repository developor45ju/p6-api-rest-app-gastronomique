const mongoose = require('mongoose');
const strRgx = /[A-Za-z\-\_]{2,50}/
const strErrorMsg = 'Nous acceptons les lettres suivantes : a à z, -, _, de 2 à 50 caractères';
const textFieldOptions = {
  type: String,
  required: true,
  match: [strRgx, strErrorMsg],
};

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: textFieldOptions,
  manufacturer: textFieldOptions,
  description: { type: String, required: true },
  mainPepper: textFieldOptions,
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] },
});

module.exports = mongoose.model('Sauce', sauceSchema);