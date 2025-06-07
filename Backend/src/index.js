const express = require("express");
const app =  express();
require("dotenv").config();
const PORT = process.env.PORT;
const {MongooseConnect} = require("./lib/DB");
const authRouter = require("./routes/auth.routes");
const cookieParser = require("cookie-parser")




app.use(express.json())
app.use(cookieParser()) 

app.use("/auth",authRouter);



MongooseConnect().then(()=>{
    console.log(`DB Connected!!`);
    
app.listen(PORT , ()=>{
    console.log("Server Start at PORT "+PORT);
    
})
}).catch((error)=>{
console.log(`Error While Connectin DB!!`);
})