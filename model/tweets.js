let mongoose = require('mongoose')

const Schema = mongoose.Schema;
let tweetsSchema = new Schema({
 user_id:{
     type:Schema.Types.ObjectId,
     ref:'users',
     required: true
 },
 user_tweets:[{
    tweet_id:{type:String,trim:true},
    Tweet:{type:String},
    sender:{type:String,trim:true},
    sender_profile_pic:{type:String,trim:true}
 }]
}, { timestamps: true });

const Tweets = mongoose.model('tweets', tweetsSchema)

module.exports = Tweets