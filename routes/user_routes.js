const { Router } = require("express");
const express=require('express')
const authentication = require('../middleware/authentication')
const router = Router();
const {fetch_user_data,fetch_user_tweets_from_twitter,fetch_user_tweets_from_database,reply_to_tweets} =require('../controller/user_controller')
const cors = require('cors')
// const Tweets = require('../model/tweets.js')
// const User = require('../model/user')


router.use(cors())
router.use(express.json())
router.get('/fetch_user_data',authentication,fetch_user_data)
router.get('/fetch_user_tweets_from_twitter',authentication,fetch_user_tweets_from_twitter)
router.get('/fetch_user_tweets_from_database',fetch_user_tweets_from_database)
router.post('/reply_to_tweets',reply_to_tweets)




module.exports=router