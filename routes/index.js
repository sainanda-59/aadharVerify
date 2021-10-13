const express = require('express');
const homeController  = require('../controllers/home_controller.js');

const router = express.Router();
router.get('/',homeController.home);
router.use('/user', require('./user'));
router.use('/admin', require('./admin'));

module.exports = router;