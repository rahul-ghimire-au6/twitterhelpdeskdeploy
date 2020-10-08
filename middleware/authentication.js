const User = require('../model/user');
const { verify } = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        if (req.header("Authorization")) {
            const userToken = req.header("Authorization")            
            const token = await verify(userToken, 'secret');            
            const user = await User.findOne({ twitter_id: token.id })            
            if (user !== [] || user !== null) {              
                req.user = user
                next()
            }
        }
        else return res.json({ "status": "failed", "message": "kindly login first" })
        next();
    }
    catch (err) {
        console.log(err.message);
        res.send({ "status": "failed", "message": "kindly login first" })
    }
}