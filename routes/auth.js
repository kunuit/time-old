var express = require('express');
var router = express.Router();

const authentication = require('../controllers/user.controller/authentication');

// tao tai khoan
router.post('/signup', authentication.signUp);
// dang nhap
router.post('/signin', authentication.signIn);

module.exports = router;
