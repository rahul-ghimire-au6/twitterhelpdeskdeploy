const User = require("../model/user");
const Twit = require("twit");
const Tweets = require("../model/tweets");

module.exports = {
  async fetch_user_data(req, res) {
    try {
      let userData = req.user;
      // console.log(userData);
      res.status(200).json({ status: "success", message: userData });
    } catch (err) {
      console.log(err.name);
      console.log(err.message);
      res.status(400).json({
        status: "failed",
        err_name: err.name,
        err_message: err.message,
      });
    }
  },
  async fetch_user_tweets_from_twitter(req, res) {
    try {
      console.log("i was called!!!!!!!!!!");
      let tweetdata = undefined;
      let userData = req.user;
      const T = new Twit({
        consumer_key: "JAABlOt9wzw9dyr8SASkPjRrj",
        consumer_secret: "ki0m1aFKtdYisdalDQUOHnfOS0EI5XC1Iez1xbhx0Htox2NwrI",
        access_token: userData.twitter_token,
        access_token_secret: userData.twitter_token_secret,
      });
      // let yahoo = await T.get("statuses/mentions_timeline")
      //  tweetdata= yahoo.data
      // console.log(tweetdata)
      // let temp = tweetdata.statuses
      // for(let i=0;i<temp.length;i++){
      //   console.log('id:- '+temp[i].id )
      //   console.log('Tweets:- '+temp[i].text)
      //   console.log('Users:- '+temp[i].user.name)
      // }

      // let yahoo = await T.get("statuses/mentions_timeline");
      // tweetdata = yahoo.data;
      // let temp = tweetdata;
      // let my_tweet_object = temp.map((element) => ({
      //   tweet_id: element.id,
      //   Tweet: element.text,
      //   sender: element.user.screen_name,
      //   sender_profile_pic: element.user.profile_image_url_https,
      // }));
      // let tweetData = {
      //   user_id: userData._id,
      //   user_tweets: my_tweet_object,
      // };
      // console.log(tweetData);

      // Tweets.findOne({ user_id: userData._id }).then((response) => {
      //   if (response) {
      //     let update_tweet = async () => {
      //       let output = await User.findOne({
      //         user_id: userData._id,
      //       }).updateOne(tweetData);
      //       res.status(200).json({ status: "success", data: output });
      //     };
      //     update_tweet();
      //   } else {
      //     let create_tweet = async () => {
      //       let output = await Tweets.create(tweetData);
      //       res.status(200).json({ status: "success", data: output });
      //     };
      //     create_tweet();
      //   }
      // });

      T.get("statuses/mentions_timeline", (err, data) => {
        if (err) console.log(err);
        tweetdata = data;
        let temp = tweetdata;
        let my_tweet_object = temp.map((element) => ({
          tweet_id: element.id,
          Tweet: element.text,
          sender: element.user.screen_name,
          sender_profile_pic: element.user.profile_image_url_https,
        }));
        // console.log(my_tweet_object)
        let tweetData = {
          user_id: userData._id,
          user_tweets: my_tweet_object,
        };
        console.log(tweetData);
        Tweets.findOne({ user_id: userData._id }).then((response) => {
          if (response) {           
            let update_tweet = async () => {              
              let new_output = await Tweets.findOneAndUpdate({user_id:userData._id},{user_tweets:tweetData.user_tweets},{new: true})
              // console.log(new_output)
            };
            update_tweet();
          } else {
            let create_tweet = async () => {
              let output = await Tweets.create(tweetData);
              // console.log(output)
            };
            create_tweet();
          }
        });
      });
      res.status(200).json({
        status: "success",
        message: "tweets has been fetched from twitter server",
      });
    } catch (err) {
      console.log(err.name);
      console.log(err.message);
      res.status(400).json({
        status: "failed",
        err_name: err.name,
        err_message: err.message,
      });
    }
  },
  async fetch_user_tweets_from_database(req, res) {
    try {
      const { verify } = require("jsonwebtoken");
      const userToken = req.header("Authorization");
      const token = await verify(userToken, "secret");
      const user = await User.findOne({ twitter_id: token.id });
      let userData = user;
      // console.log(userData);
      let userTweetsData = await Tweets.findOne({ user_id: userData._id });
      // console.log(userTweetsData);
      res.json({ status: "success", message: userTweetsData });
    } catch (err) {
      console.log(err.name);
      console.log(err.message);
      res.status(400).json({
        status: "failed",
        err_name: err.name,
        err_message: err.message,
      });
    }
  },
  async reply_to_tweets(req, res) {
    try {
      const tweetData = req.body;
      const { verify } = require("jsonwebtoken");
      const userToken = req.header("Authorization");
      const token = await verify(userToken, "secret");
      const user = await User.findOne({ twitter_id: token.id });
      let userData = user;
      // console.log(userData);      
      console.log(tweetData)
      const T = new Twit({
        consumer_key: "JAABlOt9wzw9dyr8SASkPjRrj",
        consumer_secret: "ki0m1aFKtdYisdalDQUOHnfOS0EI5XC1Iez1xbhx0Htox2NwrI",
        access_token: userData.twitter_token,
        access_token_secret: userData.twitter_token_secret,
      });
      let tweet_status = `@${tweetData.sender} ${tweetData.user_reply}`
            
      console.log(tweetData.sender_tweet_id)
      console.log(typeof(tweetData.sender_tweet_id))
      let tweets = await T.post('statuses/update', {in_reply_to_status_id_str:tweetData.sender_tweet_id, status:tweet_status })
      // console.log(tweets.data)
      if(tweets.data){
        res.json({'status':'success','message':'Successfully added Reply'})
      }
      else{
        console.log(tweets.err)
      }
      

    } catch (err) {
      console.log(err.name);
      console.log(err.message);
      res.status(400).json({
        status: "failed",
        err_name: err.name,
        err_message: err.message,
      });
    }
  },
};
