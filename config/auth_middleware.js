module.exports.ensureAuthenticated = function (req, res, next) { // ensure if user is authenticated, else redirect to login page
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please log in first!');
    res.redirect('/login-page');
}
module.exports.forwardAuthenticated = function (req, res, next) { // if user is authenticated, redirect to dashboard
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/dashboard');
}