const jwt = require("jsonwebtoken");
const { User } = require("../models/User.model");
const authMiddleware = async(req,res,next)=>{
    try {
        const token = req?.cookies?.token;
        if(!token){
            return res.status(401).json({message:`Unauthorizes User !! `})
        }
        const decodeToken =  jwt.verify(token , process.env.JWT_SECRET_KEY);
        if(!decodeToken) return res.status(401).json({message:"Unauthorized - No Token "});

        const {_id} = decodeToken;
        const user = await User.findById(_id).select("-password");
         if(!user) return res.status(404).json({message:"User Not Found!!"});

         req.user = user;

         next();
    } catch (error) {
        return res.status(500).json({message : error.message})
    }
}

module.exports =  authMiddleware