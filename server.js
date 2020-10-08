const express = require("express");
const dotenv = require("dotenv")
dotenv.config()
const passport = require("passport");
const session = require("express-session");
const morgan = require('morgan');
const { sign } = require("jsonwebtoken")
const { Strategy: TwitterStrategy } = require("passport-twitter");
require('./config/db')
const User = require('./model/user')
const userRoutes = require('./routes/user_routes')

const app = express();
app.use(passport.initialize());
app.use(morgan('dev'))
app.use(userRoutes)
app.set("trust proxy", 1); // trust first proxy

app.use(session(
{ 
 secret: 'light', 
 resave: false,
 saveUninitialized: true}
 ))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

const get_original_pic=(image)=>{
  let temp=undefined;
  if(/.jpg/gm.test(image)){
    temp = image.replace(/_normal.jpg$/gm,'.jpg')
    return temp
  }
  if(/.png/gm.test(image)){
    temp = image.replace(/_normal.png$/gm,'.png')
    return temp
  }
  if(/.jpeg/gm.test(image)){
    temp = image.replace(/_normal.jpeg$/gm,'.jpeg')
    return temp
  }
  if(/.webp/gm.test(image)){
    temp = image.replace(/_normal.webp$/gm,'.webp')
    return temp
  }
  if(/.gif/gm.test(image)){
    temp = image.replace(/_normal.gif$/gm,'.gif')
    return temp
  }
}
passport.use(
  new TwitterStrategy(
    {
      consumerKey: 'JAABlOt9wzw9dyr8SASkPjRrj',
      consumerSecret: 'ki0m1aFKtdYisdalDQUOHnfOS0EI5XC1Iez1xbhx0Htox2NwrI',
      callbackURL: "http://127.0.0.1:3000",
    },
    (token, tokenSecret, profile, done) => {
      // console.log(token);
      // console.log(tokenSecret);
      // console.log(profile);
      //checking if user already exits or not
    User.findOne({twitter_id:profile.id}).then(currentuser=>{
      if(currentuser){ 
        const generate_tok= async()=>{
          SECRET_KEY = 'secret'
            const token1 = await sign({ id: profile.id }, SECRET_KEY, {
                  expiresIn: "6h"
            })
            currentuser.jwt_token = token1
            User.updateOne(currentuser)
            .then(()=>{done(null,currentuser)})
            .catch(err=>console.log(err))
        }
        generate_tok()          
      }else{
          let generate_token = async ()=>{
              SECRET_KEY = 'secret'
              const token1 = await sign({ id: profile.id }, SECRET_KEY, {
                  expiresIn: "6h"
              })
              new User({
                  twitter_id:profile.id,
                  twitter_userName:profile.username,
                  twitter_displayName:profile.displayName,
                  twitter_profilePic_mini:profile._json.profile_image_url_https,
                  twitter_profilePic:get_original_pic(profile._json.profile_image_url_https),
                  twitter_banner_url:profile._json.profile_banner_url,
                  twitter_token:token,
                  twitter_token_secret:tokenSecret,
                  jwt_token:await token1,
              }).save().then((currentuser)=>{
              done(null,currentuser)
              })
          }
          generate_token()
      }
  })
    }
  )
);

app.get("/twitter", passport.authenticate("twitter"));
app.get(
  "/",
  passport.authenticate("twitter", {
    failureRedirect: "http://127.0.0.1/user",
  }),
  (req, res) => {  
    res.redirect(`http://127.0.0.1:3001/home/${req.user.jwt_token}`)
  }
);

let Port = process.env.PORT || 3000
app.listen(Port, () => {
    console.log(`Server listening at ${Port}`)
})
