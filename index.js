require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.port || 9000;
const db = require('./config/mongoose');
const path = require('path');
const session = require('express-session');
const expresslayouts = require('express-ejs-layouts');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const flash = require('connect-flash');
const customMiddleware = require('./config/middleware');
const passport = require('passport');
//------------ Passport Configuration ------------//
require('./config/passport')(passport);


/* for broswer reload after changes in code */
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});


app.use(session({   // session details
    name: 'bug-tracker-app',
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 },
    saveUninitialized: false,
    resave: false,
}));

app.use(flash()); // use flash messages
app.use(customMiddleware.setFlash); // set flash messages from middleware
app.use(connectLiveReload()); // use the connect live reload
app.use(express.urlencoded({ extended: true })); // parsing incoming requests with urlencoded payloads
app.use(express.static('assets')); // use static files (css,js)
app.use(expresslayouts); // use the layouts

//------------ Passport Middlewares ------------//
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

//------------ Global variables ------------//
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// extract style and script from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set the views and view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', require('./routes')); // use express routers


app.listen(port, function (err) { // start the app
    if (err) {
        console.log(`Error in running the server on port: ${err}!`);
    }
    console.log(`Server running on port: ${port}!`);
});