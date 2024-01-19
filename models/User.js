const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const emailRgx = /^[A-Za-z1-9\-\.]{1,64}@[A-Za-z\-\.]{1,255}\.[A-Za-z]{1,63}$/;
const emailErrorMessage = 'Merci de renseigner un courriel correct';

const passwordRgx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{12,}$/;
const passwordErrorMessage = 'Le mot de passe ne correspond aux attentes de sécurité attendu';

const userSchema = mongoose.Schema({
  email: { 
    type: String,
    required: true,
    unique: true,
    match: [emailRgx, emailErrorMessage],
  },
  password: {
    type: String,
    required: true,
    match: [passwordRgx, passwordErrorMessage],
  },
});

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', userSchema);