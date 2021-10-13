const express = require('express');
const userContoller  = require('../controllers/user_controller.js');

const router = express.Router();
router.get('/',userContoller.subPage);
module.exports = router;