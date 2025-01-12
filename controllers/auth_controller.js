require('dotenv').config()
const passport = require('passport');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//------------ Environment variables ------------//
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;
const redirect_uris = process.env.redirect_uris;
const refresh_token = process.env.refresh_token;
const auth_email_id = process.env.auth_email_id;
const JWT_KEY = process.env.JWT_KEY;
const JWT_RESET_KEY = process.env.JWT_RESET_KEY;
const APP_PASS_FOR_GMAIL = process.env.APP_PASS_FOR_GMAIL;


// module.exports.createUser = async function (req, res) { // creating a user
//     try {
//         const { first_name, last_name, email, password, confirm_password } = req.body; // taking data from form body
//         let errors = {}
//         User.findOne({ email: email }).then(user => { // finding user in db
//             if (user) { // email is already registered
//                 errors.email_error_msg = "Email already registered";
//                 res.render('sign_up_page', { // if already registered, send to sign up page
//                     title: 'Node js Authentication | Register',
//                     errors,
//                     first_name,
//                     last_name,
//                     email,
//                     password,
//                     confirm_password,
//                 });
//             } else { // create the activation link and send to user
//                 const oauth2Client = new OAuth2(
//                     client_id,
//                     client_secret,
//                     redirect_uris,
//                 );

//                 oauth2Client.setCredentials({
//                     refresh_token: refresh_token,
//                 });
//                 const accessToken = oauth2Client.getAccessToken()

//                 const token = jwt.sign({ first_name, last_name, email, password }, JWT_KEY, { expiresIn: '10m' });
//                 const CLIENT_URL = 'https://' + req.headers.host;
//                 console.log("CLIENT_URL",CLIENT_URL)

//                 const output = `
//                 <h2>Please click on below link to activate your account</h2>
//                 <p>${CLIENT_URL}/auth/activate/${token}</p>
//                 <p><b>NOTE: </b> The above activation link expires in 10 minutes.</p>
//                 `;

//                 const transporter = nodemailer.createTransport({
//                     service: 'gmail',
//                     auth: {
//                         type: "OAuth2",
//                         user: auth_email_id,
//                         clientId: client_id,
//                         clientSecret: client_secret,
//                         refreshToken: refresh_token,
//                         accessToken: accessToken,
//                     },
//                 });

//                 // send mail with defined transport object
//                 const mailOptions = {
//                     from: `Auth Admin ${auth_email_id}`, // sender address
//                     to: email, // list of receivers
//                     subject: "Account Verification: NodeJS Authenticator", // Subject line
//                     generateTextFromHTML: true,
//                     html: output, // html body
//                 };

//                 transporter.sendMail(mailOptions, (error, info) => {
//                     if (error) {
//                         console.log(error);
//                         req.flash(
//                             'error',
//                             'Something went wrong on our end. Please register again.'
//                         );
//                         res.redirect('/login-page');
//                     }
//                     else {
//                         req.flash(
//                             'success',
//                             'Activation link sent to Email ID. Please activate to log in.'
//                         );
//                         res.redirect('/login-page');
//                     }
//                 })

//             }
//         })
//     } catch {
//         console.log('Error in creating user, code=>', err);
//         return;
//     }
// };


module.exports.createUser = async function (req, res) {
    const { first_name, last_name, email, password, confirm_password } = req.body;
    let errors = {};

    try {
        // Check if user exists with the same email
        const user = await User.findOne({ email });
        if (user) {
            errors.email_error_msg = "Email already registered";
            return res.render('sign_up_page', {
                title: 'Node js Authentication | Register',
                errors,
                first_name,
                last_name,
                email,
                password,
                confirm_password,
            });
        }

        // Create the activation link and send email
        const token = jwt.sign({ first_name, last_name, email, password }, JWT_KEY, { expiresIn: '10m' });
        const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
        const CLIENT_URL = `${protocol}://${req.headers.host}`;
        console.log("CLIENT_URL",CLIENT_URL)

        const output = `
            <h2>Please click on below link to activate your account</h2>
            <p>${CLIENT_URL}/auth/activate/${token}</p>
            <p><b>NOTE: </b> The above activation link expires in 10 minutes.</p>
        `;

        // const accessToken = await getAccessToken();
        // console.log("accessToken",accessToken)
        const mailOptions = {
            from: `Auth Admin <${auth_email_id}>`, 
            to: email, 
            subject: "Account Verification: NodeJS Authenticator", 
            generateTextFromHTML: true,
            html: output, 
        };

        // const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         type: "OAuth2",
        //         user: auth_email_id,
        //         clientId: client_id,
        //         clientSecret: client_secret,
        //         refreshToken: refresh_token,
        //         accessToken,
        //     },
        // });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: auth_email_id,
                pass: APP_PASS_FOR_GMAIL,
            },
        });

        await sendVerificationEmail(transporter, mailOptions);

        req.flash('success', 'Activation link sent to Email ID. Please activate to log in.');
        res.redirect('/login-page');
    } catch (err) {
        console.error('Error in creating user:', err);
        req.flash('error', 'Something went wrong. Please try again.');
        // res.redirect('/sign-up-page');
    }
};

// Helper function to get access token
// Helper function to get access token with error handling
async function getAccessToken() {
    try {
        const oauth2Client = new OAuth2(client_id, client_secret, redirect_uris);
        oauth2Client.setCredentials({ refresh_token });

        const { token } = await oauth2Client.getAccessToken();
        if (!token) {
            throw new Error('Failed to retrieve access token. Token is undefined or null.');
        }

        return token;
    } catch (error) {
        console.error('Error while fetching access token:', error);
        console.error('Error Message while fetching access token:', error.message);

        // Check for specific Google API errors
        if (error.response && error.response.data) {
            console.error('Google API Error Details:', error.response.data);
        }

        // Rethrow the error to allow the calling function to handle it
        throw new Error(`Failed to get access token: ${error.message}`);
    }
}


async function sendVerificationEmail(transporter, mailOptions) {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(error);
            } else {
                console.log('Email sent successfully:', info);
                resolve(info);
            }
        });
    });
}


module.exports.handleActivate = (req, res) => { // when user clicks on activation link, redirect to sign in  page
    const token = req.params.token;
    if (token) {
        jwt.verify(token, JWT_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error',
                    'Incorrect or expired link! Please register again.'
                );
                res.redirect('/register-page');
            }
            else {
                const { first_name, last_name, email, password } = decodedToken;
                User.findOne({ email: email }).then(user => {
                    if (user) { // user already exists, redirect to login page
                        req.flash(
                            'error',
                            'Email ID already registered! Please log in.'
                        );
                        res.redirect('/login-page');
                    } else {    // create user in db
                        const newUser = new User({
                            first_name,
                            last_name,
                            email,
                            password,
                            verified: true,
                        });

                        bcryptjs.genSalt(10, (err, salt) => { // store password in hash form
                            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser
                                    .save()
                                    .then(user => {
                                        req.flash(
                                            'success',
                                            'Account activated. You can now log in.'
                                        );
                                        res.redirect('/login-page');
                                    })
                                    .catch(err => console.log(err));
                            });
                        });
                    }
                });
            }

        })
    }
    else {
        console.log("Account activation error!")
    }
}


exports.forgotPassword = (req, res) => { // forgot password controller
    const { email } = req.body;

    let errors = {};
    User.findOne({ email: email }).then(user => {
        if (!user) { // user does not exist
            errors.email_error_msg = "Email ID does not exist";
            res.render('forgot_password_page', { // render the forgot password page
                title: 'Node js Authentication | Forgot Password',
                errors,
                email,
            });
        } else { // create the reset link and send to email
            const oauth2Client = new OAuth2(
                client_id,
                client_secret,
                redirect_uris,
            );

            oauth2Client.setCredentials({
                refresh_token: refresh_token,
            });
            const accessToken = oauth2Client.getAccessToken()

            const token = jwt.sign({ _id: user._id }, JWT_RESET_KEY, { expiresIn: '10m' });
            const CLIENT_URL = 'http://' + req.headers.host;
            const output = `
                <h2>Please click on below link to reset your account password</h2>
                <p>${CLIENT_URL}/auth/forgot/${token}</p>
                <p><b>NOTE: </b> The activation link expires in 10 minutes.</p>
                `;

            User.updateOne({ resetLink: token }, (err, success) => { // store reset link in db
                if (err) {
                    errors.email_error_msg = "Error in resetting the password!";
                    res.render('forgot', {
                        title: 'Node js Authentication | Forgot Password',
                        errors,
                        email
                    });
                }
                else {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            type: "OAuth2",
                            user: auth_email_id,
                            clientId: client_id,
                            clientSecret: client_secret,
                            refreshToken: refresh_token,
                            accessToken: accessToken
                        },
                    });

                    // send mail with defined transport object
                    const mailOptions = {
                        from: `Auth Admin ${auth_email_id}`, // sender address
                        to: email, // list of receivers
                        subject: "Account Password Reset: NodeJS Authenticator", // Subject line
                        html: output, // html body
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            req.flash(
                                'error',
                                'Something went wrong on our end. Please try again later.'
                            );
                            res.redirect('/forgot-password-page');
                        }
                        else {
                            req.flash(
                                'success',
                                'Password reset link sent to email ID. Please follow the instructions.'
                            );
                            res.redirect('/login-page');
                        }
                    })
                }
            })

        }
    });
    // }
}


exports.handleForgotPassword = (req, res) => { // handle forgot password controller
    const { token } = req.params;

    if (token) {
        jwt.verify(token, JWT_RESET_KEY, (err, decodedToken) => {
            if (err) {
                req.flash(
                    'error',
                    'Incorrect or expired link! Please try again.'
                );
                res.redirect('/login-page');
            }
            else {
                const { _id } = decodedToken;
                User.findById(_id, (err, user) => {
                    if (err) { // user not found in db
                        req.flash(
                            'error',
                            'User with email ID does not exist! Please try again.'
                        );
                        res.redirect('/login-page');
                    }
                    else { // redirect to reset password page
                        res.redirect(`/reset-password-page/${_id}`)
                    }
                })
            }
        })
    }
    else {
        console.log("Password reset error!")
    }
}


exports.resetPassword = (req, res) => { // reset password controller
    var { password } = req.body;
    const id = req.params.id;
    bcryptjs.genSalt(10, (err, salt) => {   // hash the password
        bcryptjs.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;

            User.findByIdAndUpdate( // update password in db
                { _id: id },
                { password },
                function (err, result) {
                    if (err) {
                        req.flash(
                            'error',
                            'Error resetting password!'
                        );
                        res.redirect(`/reset-password-page/${id}`);
                    } else {
                        req.flash(
                            'success',
                            'Password reset successfully!'
                        );
                        res.redirect('/login-page');
                    }
                }
            );

        });
    });
}


module.exports.createSession = (req, res) => { // create session controller
    req.flash('success', 'Logged in!');
    return res.redirect('/dashboard');
}

module.exports.destroySession = (req, res) => { // destroy session controller
    req.flash('success', 'Logged out!');
    setTimeout(() => { // need to put req.logout inside set timeout so that req.flash gets displayed
        req.logout(function (error) {
            if (error) {
                console.log("Error!Cannot sign out the user. code =>", error);
            }

        });
    }, "1000")
    let msg = "logout"
    res.render('home_page', {
        title: 'Node js Authenticator | Home',
        msg: msg,
    });
}
