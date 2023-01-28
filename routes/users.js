const User = require("../models/User.js");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// update user
router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body, // This is automatically set the body after update
            });
            res.status(200).json("Your account has been updated!")
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can only update your account!");
    }
});

// delete user
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Your account has been deleted!");
        } catch(err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can only delete your account!");
    }
});

// get a user
router.get("/:id", async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc  // This allow us to not get password,updatedAt information when we send a request to get an user
        res.status(200).json(other);
    } catch(err) {
        res.status(500).json(err);
    }
})

// get a list of followers for a specific user
router.get("/:id/followers",async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user.followers);
    } catch(err) {
        res.status(500).json(err);
    }
});

// get a list of following of a user
router.get("/:id/following", async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user.following);
    } catch(err) {
        res.status(500).json(err);
    }
});

// follow a user
router.put("/:id/follow", async (req,res)=>{
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({$push: {followers: req.body.userId} });
                await currentUser.updateOne({$push: {following: req.params.id} });
                res.status(200).json("User has been followed");
            } else {
                res.status(403).json("You already follow this user");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can't follow yourself!")
    }
})

// unfollow a user
router.put("/:id/unfollow", async (req,res)=>{
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({$pull: {followers: req.body.userId} });
                await currentUser.updateOne({$pull: {following: req.params.id} });
                res.status(200).json("User has been unfollowed");
            } else {
                res.status(403).json("You don't follow this user");
            }
        } catch(err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can't unfollow yourself!")
    }
})

module.exports = router