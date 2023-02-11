const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

// register
router.post("/register", async (req,res)=> {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // create new user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        console.log("the success part " + newUser);

        const token = await newUser.generateAuthToken();
        console.log("the token part " + token);

        // save user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(err);
    }
    // This was to just check the connection of our file to mongodb
    /*
    const user = await new User({
        username:"Neha",
        email:"ndkumari@gmail.com",
        password:"123456"
    })
    await user.save();
    res.send("ok");
    */
});

// login
router.post("/login",async (req,res)=>{
    try {
        // findOne() because there should be only one user with a particular email
        const user = await User.findOne({email:req.body.email});
        // if the user email is not found then we send its status as 404
        if(!user) 
            return res.status(404).json("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);

        const token = await user.generateAuthToken();
        console.log("the token part " + token);

        if(!validPassword)
            return res.status(400).json("wrong password");

        return res.status(200).json(user);
    } catch(err) {
       return res.status(500).json(err);
    }
    
})

module.exports = router;