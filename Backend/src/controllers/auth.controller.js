const { User } = require("../models/User.model");
const { validateData}= require("../utils/Validation")
const bcrypt = require("bcrypt")

const sendEmail = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOTP");




const signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        validateData(req);

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashPassword = await bcrypt.hash(password, 10);

        const otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000; 

        const user = new User({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password: hashPassword,
            otp,
            ExpiryOtp: otpExpiry,
        });

        const newUser = await user.save();

        await sendEmail(email, "Verify Your EchoMind.ai OTP", `Your OTP is ${otp}. It expires in 5 minutes.`);

        return res.status(200).json({
            message: `OTP sent to ${email}. Please verify to continue.`,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Credentials Required!" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Invalid Credentials" });

        const isValidPassword = await user.verifyPassword(password);
        if (!isValidPassword) return res.status(400).json({ message: "Incorrect Password!" });

        const otp = generateOTP();
        const otpExpiry = Date.now() + 5 * 60 * 1000; 

        user.otp = otp;
        user.ExpiryOtp = otpExpiry;
        await user.save();

        await sendEmail(email, "EchoMind Login OTP", `Your login OTP is ${otp}. Valid for 5 minutes.`);

        return res.status(200).json({ message: "OTP sent to your email. Please verify to login." });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};

const logout = async(req,res)=>{
    try {
           res.cookie("token", null, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(Date.now()),
        });
        return res.status(200).json({message:"Logout Successfully!!"})
    } catch (error) {
         return res.status(500).json({message : error.message || "Server Error"})
    }
}
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.otp !== otp || Date.now() > user.ExpiryOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = null;
        user.ExpiryOtp = null;

        await user.save();

        const token = await user.getJWT();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ message: "Email verified successfully", data: user });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};

const verifyLoginOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.otp !== otp || Date.now() > user.ExpiryOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

      
        user.otp = null;
        user.ExpiryOtp = null;
        await user.save();

        const token = await user.getJWT();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        const { password: _, ...userData } = user.toObject();

        return res.status(200).json({
            message: `Welcome back ${user.firstName}`,
            data: userData
        });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Server Error" });
    }
};

module.exports = {signup,login , logout , verifyLoginOTP , verifyOTP};