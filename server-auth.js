/* jshint node: true */
'use strict';

var express = require('express'),
    jwt = require('jwt-simple'),
    bcrypt = require('bcrypt'),
    User = require('./user');

var app = express();

app.use(require('body-parser').json());

var secretKey = 'supersecretkey';

app.post('/session', function (req, res, next) {
  var token;
  User.findOne({ username: req.body.username })
  .select('password')
  .exec(function (err, user) {
    if (err) { return next(err); }
    if (!user) { return res.sendStatus(401); }
    bcrypt.compare(req.body.password, user.password, function (err, valid) {
      if (err) { return next(err); }
      if (!valid) { return res.sendStatus(401); }
      token = jwt.encode({ username: req.body.username }, secretKey);
      res.json(token);
    });
  });
});

app.get('/user', function (req, res) {
  var token, auth;
  token = req.headers['x-auth'];
  auth = jwt.decode(token, secretKey);
  User.findOne({ username: auth.username }, function (err, user) {
    res.json(user);
  });
});

app.post('/user', function (req, res, next) {
  var user;
  user = new User({ username: req.body.username });
  bcrypt.hash(req.body.password, 10, function (err, hash) {
    user.password = hash;
    user.save(function (err) {
      if (err) { throw next(err); }
      res.status(201).send(user.username + " / " + user.password);
    });
  });
});

app.listen(3000);
