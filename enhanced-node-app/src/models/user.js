const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String, // Note: In production, ensure passwords are hashed!
  email: String
});

module.exports = mongoose.model('User', userSchema);
