const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const users = require('../controllers/users');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.route('/register').get(users.registerForm).post(catchAsync(users.registerUser));
router.route('/login').get(users.loginForm).post(passport.authenticate('local', { keepSessionInfo: true, failureFlash: true, failureRedirect: '/login' }), users.loginUser);
router.get('/logout', users.logoutUser);

module.exports = router;