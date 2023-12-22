const express = require('express');
const sauceCtrl = require('../controllers/sauce.js');

const auth = require('../middleware/auth.js');
const multer = require('../middleware/multer-config.js');

const router = express.Router();

router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.postSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);


module.exports = router;