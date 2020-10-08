let mongoose = require('mongoose')

const Schema = mongoose.Schema;
let userSchema = new Schema({
  twitter_id:{type:String,trim:true},
  twitter_userName: { type: String, trim: true },
  twitter_displayName: { type: String, trim: true },
  twitter_profilePic_mini: { type: String, trim: true },
  twitter_profilePic: { type: String, trim: true },
  twitter_banner_url:{type: String,trim: true},
  twitter_token:{type: String,trim: true},
  twitter_token_secret:{type: String,trim:true},
  jwt_token:{type: String,trim: true}
}, { timestamps: true });

const User = mongoose.model('users', userSchema)

module.exports = User