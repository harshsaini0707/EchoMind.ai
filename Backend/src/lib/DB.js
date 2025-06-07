const mongoose = require("mongoose");
require("dotenv").config();

const MongooseConnect = async()=>{
    mongoose.connect(process.env.MONGO_URL)
}

module.exports = {MongooseConnect}