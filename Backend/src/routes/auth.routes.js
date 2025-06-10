const express = require("express");
const { login, signup, logout , verifyOTP  } = require("../controllers/auth.controller");
const authRouter = express.Router();


authRouter.post("/signup", signup);
// authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/login", login); 
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/logout", logout);

module.exports = authRouter;