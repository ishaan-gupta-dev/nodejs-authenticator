const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
            User.findOne({ // match email id
                email: email
            }).then(user => {
                if (!user) {
                    return done(null, false, { message: 'Email ID not registered!' });
                }

                bcrypt.compare(password, user.password, (err, isMatch) => { // match passwords
                    if (err) throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect Password!' });
                    }
                });
            });
        })
    );

    passport.setAuthenticatedUser = function (req, res, next) {
        if (req.isAuthenticated()) {
            // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
            res.locals.user = req.user;
        }
        next();
    }

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            if (err) {
                console.log('Error! Cannot find the user in passport deserialize user ,code =>', err);
                return done(err);
            }
            done(err, user);
        });
    });
};