const express = require('express');
const hotsauceCtrl = require('../controllers/hotsauce.js');

const router = express.Router();

router.get('/', hotsauceCtrl.getAllHotsauces);
// router.post('/login', userCtrl.login);

module.exports = router;