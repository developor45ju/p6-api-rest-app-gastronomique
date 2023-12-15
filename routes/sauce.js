const express = require('express');
const sauceCtrl = require('../controllers/sauce.js');

const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, sauceCtrl.postSauce);

module.exports = router;