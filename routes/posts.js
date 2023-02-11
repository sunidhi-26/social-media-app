const router = require("express").Router();
const Post = require("../models/Post");
const checkAuth = require("../middleware/auth-middleware.js");

// create a post
router.post("/",checkAuth, async (req,res)=>{
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch(err) {
        res.status(500).json(err);
    }
});

// update a post
router.put("/:id",checkAuth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({$set:req.body});
            res.status(200).json("You post has been updated!")
        } else {
            res.status(403).json("You can only update your post.")
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

// delete a post
router.delete("/:id",checkAuth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("You post has been deleted!")
        } else {
            res.status(403).json("You can only delete your post.")
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

// like/dislike a post
router.put("/:id/like",checkAuth, async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("The post has been liked.");
        } else {
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json("The post has been disliked");
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

// get a post
router.get("/:id",checkAuth, async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;