const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

const { ensureAuthenticated } = require('../config/auth_middleware');


router.get('/', homeController.home); // direct / routes to home controller

router.get('/register-page', (req, res) => res.render('sign_up_page', { title: 'Node js Authenticator | Register', errors: {} })); // direct /register route to sign up page

router.get('/login-page', (req, res) => res.render('sign_in_page', { title: 'Node js Authenticator | Login' })); // direct /login route to sign up page

router.get('/forgot-password-page', (req, res) => res.render('forgot_password_page', { title: 'Node js Authenticator | Forgot Password', errors: {} })); // direct /forgot-password-page route to forgot password page


router.get('/reset-password-page/:id', (req, res) => { // direct /reset-password-page to reset password page
    res.render('reset_password_page', { title: 'Node js Authenticator | Reset Password', id: req.params.id })
});

router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('user_dashboard_page', { // direct /dashboard route to user dashbaord page
    title: 'Node js Authenticator | Dashboard',
    first_name: req.user.first_name,
    last_name: req.user.last_name
}));
router.get('/privacy-policy', (req, res) => res.render('privacy_policy', { title: 'Node js Authenticator | Privacy Policy' })); // direct /login route to sign up page
router.get('/terms-of-service', (req, res) => res.render('terms_of_service', { title: 'Node js Authenticator | Terms of Service' })); // direct /login route to sign up page
router.use('/auth', require('./auth')); // direct /auth routes to auth folder 

module.exports = router;
