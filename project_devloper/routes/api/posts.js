const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


// Post Model & Profile
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
//Validation
const validatePostInput = require('../../validation/post');

router.get('/test', ( req, res ) => res.json({msg:"Post Works"
}))
// @route Post api/posts
// @desc Create Post
// access public
router.get('/', ( req , res ) => {
    Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts'})
    );
})
// @route Post api/posts/:id
// @desc get post by id 
// access public
router.get('/:id', ( req , res ) => {
    Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => 
        res.status(404).json({ nopostfound: 'No post found with that ID'})
        );
})
// @route Post api/posts
// @desc Create Post
// access private
router.post("/", passport.authenticate('jwt', {session: false}), (req,res) => {
    const { errors , isValid } = validatePostInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
    const newPost = new Post ({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });
    newPost.save().then(post => res.json(post) )
});

// @route Post api/posts
// @desc Create Post
// access private
router.delete('/:id' , passport.authenticate('jwt' , { session: false}) , (req,res) => {
    Profile.findOne({ user: req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            //Check for post owner
            if(post.user.toString() !== req.user.id ){
                return res.status(401).json({ notauthorized: 'User not Authorized '})
            }
            //Delete 
            Post.remove().then(() => res.json({ success: true }))
        })
        .catch( err => res.status(404).json({postnotfound: 'No post found'}))
    })
})

// @route Post api/posts/like/:id
// @desc Create Post
// access private
router.post('/like/:id' , passport.authenticate('jwt' , { session: false}) , (req,res) => {
    Profile.findOne({ user: req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                return res.status(400).json( {alreadyliked: 'User already liked this post'} )
            }

            //Add user id to likes array 
            post.like.unshift({ user: req.user.id });
            post.save().then(post => res.json(post)); 
        })
        .catch( err => res.status(404).json({postnotfound: 'No post found'}))
    })
})

// @route delete api/posts/like/:id
// @desc unlike post
// access private
router.post('/unlike/:id' , passport.authenticate('jwt' , { session: false}) , (req,res) => {
    Profile.findOne({ user: req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length = 0) {
                return res.status(400).json( {notliked: 'You have not yet liked this post'} )
            }

            // get remove index
            const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

            // splice out of array
            post.likes.splice(removeIndex , 1)

            post.save().then( post => res.json(post))
        })
        .catch( err => res.status(404).json({postnotfound: 'No post found'}))
    })
})


module.exports = router;
