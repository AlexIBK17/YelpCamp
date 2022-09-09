const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync')
const { renderRegister, registerUser, renderLogin, loginUser, logout } = require('../Controllers/user');

router.route('/register')
    .get(renderRegister)
    .post(catchAsync(registerUser))

router.route('/login')
    .get(catchAsync(renderLogin))
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), catchAsync(loginUser));

router.get('/logout', logout);



module.exports = router;