const mongoose = require('mongoose')
const dotenv=require('dotenv')
dotenv.config()

const { MONGODB_PASS, MONGODB_URL } = process.env

let connect = async () => {
    try {
        await mongoose.connect(MONGODB_URL.replace("<password>", MONGODB_PASS), {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })
        await console.log("db connected successfully")
    } catch (err) {
        console.log(err)
    }
}
connect()

module.export = mongoose; 