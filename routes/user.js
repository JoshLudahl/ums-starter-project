const express = require('express');
const router = express.Router();
const UserModel = require('../model/model');

//  Lets say the route below is very sensitive and we want only authorized users to have access

//  Displays information tailored according to the logged in user
router.get('/profile', (req, res, next) => {


  res.render('user/profile', {
    message: 'You made it to the secure route',
    user: req.user,
    token: req.query.signed_token
  });
  //  We'll just send back the user details and the token
  // res.json({
  //   message : 'You made it to the secure route',
  //   user : req.user,
  //   token : req.query.signed_token
  // })
});

router.get('/usersList', (req, res, next) => {
  UserModel.find()
    .exec()
    .then(result => {
      res.status(200).json({
        result
      });
      next();
    })
    .catch(error => {
      return error;
    });
});

module.exports = router;