var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/auth_demo');

var User = mongoose.Schema({
  username: String,
  password: { type: String, select: false }
});

module.exports = mongoose.model('User', User);
