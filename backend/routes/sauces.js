const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauces');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauces);
router.post('/', auth, multer, sauceCtrl.createSauces);
router.put('/:id', auth, multer, sauceCtrl.modifySauces);
router.delete('/:id', auth, sauceCtrl.deleteSauces);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;