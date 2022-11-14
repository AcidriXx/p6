const express = require('express');
const router = express.Router();
const unserCtrl = require('../controllers/user');

router.post('/signup', unserCtrl.signup);
router.post('/login', unserCtrl.login);


module.exports = router;