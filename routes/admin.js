const express = require('express');
const adminContoller  = require('../controllers/admin_controller.js');

const router = express.Router();
router.get('/',adminContoller.signIn);
router.post('/signIn',adminContoller.Login);

module.exports = router;