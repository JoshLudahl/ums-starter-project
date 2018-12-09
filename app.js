const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const path = require('path');
const cookie_parser = require('cookie-parser');

const UserModel = require('./model/model');

app.use(cookie_parser());
//  Connect to MongoDB
const connectionURL ='mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PW + '@ds035806.mlab.com:35806/mlab_2014'
mongoose.connect(connectionURL, {useNewUrlParser: true, useCreateIndex: true});

mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

//  Paths
app.set('views', path.join(__dirname, '/view/pages'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

require('./auth/auth');

app.use( bodyParser.urlencoded({ extended : false }) );

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-route');

app.use('/', routes);
//  We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/user', passport.authenticate('jwt', { session : false }), secureRoute );

//  Handle errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error : err });
});

module.exports = app;