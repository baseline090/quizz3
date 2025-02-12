

const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, 
  password: { type: String, required: true },
  otp: { type: String, default: null }, 
  phoneNumber: { type: String, default: null }, 
  profilePic: { type: String, default: "" }, 
  role: {
    type: String,
    enum: ['admin', 'user'], 
    default: 'user',
  },
}, { timestamps: true });



module.exports = mongoose.model('User', userSchema);
