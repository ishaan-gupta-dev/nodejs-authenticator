module.exports.setFlash = function (req, res, next) {   // flash middleware
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }
    next();
}