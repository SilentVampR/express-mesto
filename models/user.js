const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  about: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    required: true,
    minlength: 10
  }
});

module.exports = mongoose.model('user', userSchema)