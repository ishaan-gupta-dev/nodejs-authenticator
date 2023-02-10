const express = require('express');
const passport = require('passport');

const router = express.Router();
const authController = require('../controllers/auth_controller');


router.post('/create-user', authController.createUser); // direct /create-user to create user controller

router.get('/activate/:token', authController.handleActivate); // handle, when user clicks on activatation link

router.post('/forgot-password', authController.forgotPassword); // direct /forgot-password to forgot password controller
router.get('/forgot/:token', authController.handleForgotPassword); // handle, when user clicks on forgot password link sent to email

router.post('/reset-password/:id', authController.resetPassword); // direct /reset-password to reset password controller

router.post('/create-session', passport.authenticate('local', { failureRedirect: '/login-page', failureFlash: true }), authController.createSession); // direct /create-session to create session controller
router.get('/destroy-session', authController.destroySession); // direct /destroy-session to destroy session controller

module.exports = router;
