const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

//  When the user sends a post request to this route, passport authenticates the user based on the
//  middleware created previously
router.post('/signup', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
  res.json({
    message : 'Signup successful',
    user : req.user
  });
});

// GET Login Page
router.get('/login', (req, res, next) => {

  res.set('Authorization', 'Bearer ');
  res.render('index');
});

//  Attempt to login
router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {     try {
        if(err || !user){
          const error = new Error('An Error occured')
          res.status(500).json({message: 'error logging in'});
          return next();
        }
        req.login(user, { session : false }, async (error) => {
          if( error ) return next(new errors.UnauthorizedError(error));
          //  We don't want to store the sensitive information such as the
          //  user password in the token so we pick only the email and id
          const body = { _id : user._id, email : user.email };
          //  Sign the JWT token and populate the payload with the user email, id, and expiresIn variables
          const token = jwt.sign({ user : body }, process.env.JWT_KEY,{
            expiresIn: '1h'
          });
          //  Send back the token to the user
          res.cookie('signed_token', token);
          return res.redirect('/user/profile/?signed_token=' + token);
        });     } catch (error) {

        return next(error);
      }
    })(req, res, next);
  });

  module.exports = router;