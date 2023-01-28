const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgon = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL,{
    
}, ()=> {
    console.log("Connected to MongoDB");
});

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgon("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

// This is used to show the "Welcome to homepage!" messsage on homepage of localhost:8800
/*
app.get("/",(req,res)=> {
    res.send("Welcome to homepage!")
})
*/


app.listen(8800,()=>{
    console.log("Backend server is running!");
})