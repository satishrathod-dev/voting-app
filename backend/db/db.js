const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DB")

    }
    catch(err){
        console.log("Error connecting to DB", err)
    }
}

module.exports = connectDB