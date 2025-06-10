const express = require("express");
const app =  express();
require("dotenv").config();
const PORT = process.env.PORT;
const {MongooseConnect} = require("./lib/DB");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser")
const transcriptionRoutes = require("./routes/transcription.routes")
const cors = require("cors")
const path = require("path");

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(express.json())
app.use("/public", express.static(path.join(__dirname, "public"))); // to serve TTS audio
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()) 

app.use("/auth",authRouter);
app.use("/audio", transcriptionRoutes);



MongooseConnect().then(()=>{
    console.log(`DB Connected!!`);
    
app.listen(PORT , ()=>{
    console.log("Server Start at PORT "+PORT);
    
})
}).catch((error)=>{
console.log(`Error While Connectin DB!!`);
})