const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken");
const bcrypt =  require("bcrypt")
require("dotenv").config();

const userSchema = new mongoose.Schema({
    firstName :{
        type:String,
        required:true,
        trim : true,
    },
    lastName :{
        type:String,
        trim : true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                return res.json({message:value+"Not a Valid Email Type"})
            }
        }

    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        default:"https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?ga=GA1.1.924298433.1749212614&semt=ais_hybrid&w=740"
    },
    otp:{
        type:String,
    },
    ExpiryOtp :{
        type:Date 
    },
    isVerified:{
        type:Boolean,
        default:false
    }

},{timestamps:true});

userSchema.methods.getJWT =  async function(){
    try {
        const user = this;

    const token =  jwt.sign({_id:user._id} , process.env.JWT_SECRET_KEY , {
        expiresIn:"3d"
    })

   return token;
    } catch (error) {
         throw new Error("Failed to generate JWT token");  
    }


}

userSchema.methods.verifyPassword = async function (inputPassword) {
    try {
        return await bcrypt.compare(inputPassword, this.password);
    } catch (err) {
        throw new Error("Incorrect Password!!");
    }
};

const User = mongoose.model("User",userSchema);

module.exports = {User};