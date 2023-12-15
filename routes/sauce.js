const express = require('express');
const sauceCtrl = require('../controllers/sauce.js');

const router = express.Router();

router.get('/', sauceCtrl.getAllSauces);
router.post('/', sauceCtrl.postSauce);

module.exports = router;