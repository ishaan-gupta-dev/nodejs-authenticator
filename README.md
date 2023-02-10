# Nodejs Authenticator

A Complete authentication system which can be used as a starter code for creating any new application.

## Features

- Neat and simple UI.
- Form validation is done on every form.
- All errors are handled and displayed.
- Password criteria:
  - Minimum 8 characters long.
- Home Page:
  - Create Account button.
  - Sign in Button.
- Create Account Page:
  - Enter firt name, last name, email, password and confirm password
  - On success, Activation Link sent to email for verification else error shown.
  - Clicking on Activation Link redirects to login page.
- Login Page:
  - Enter email and password
  - On success, redirects to user dashboard page.
  - On failure, displays the appropriate error.
- Forgot Password Page:
  - Enter the email.
  - If registered, sends the reset link to email else shows error that email is not registered.
  - On clicking the reset link, redirects to Reset password page.
- Reset Password Page:
  - Enter password and confrom password.
  - If password criteria matches, resets the password.
- Flash messages after actions accordingly

## Deployment

To deploy this project run

```bash
npm start
```

Hosted on

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`client_id` - google api client id

`client_secret` - google api client secret

`redirect_uris` - google api callback URL

`refresh_token` - google api refresh roken

`auth_email_id` - email id with which you will send email for links

`JWT_KEY` - random key to generate JWT key

`JWT_RESET_KEY` - random key to generate JWT reset key

## Tech Stack

Node.js, Express.js, MongoDB, EJS, Google APIs, JWT, Mongoose, Passport.js, Nodemailer
