const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experince');
const validateEducationInput = require('../../validation/education');

//load profile model
const Profile = require('../../models/Profile')
const User = require('../../models/Users')

// instead of doing app.get .. we use router.get
// also /test .. means /api/profiles/test we already included it in server.js 
// this is a Public route

// public acees
//get profile by handle
// api/profile/handle/:handle

router.get('/handle/:handle' , ( req, res ) => {
    const errors = {} // initiallizing error handler
    Profile.findOne({ handle: req.params.handle })
    .populate('user' , [' name ', 'avatar '])
    .then(profile => {
        if(!profile) {
            errors.noprofile = 'There is no profile for this user '
            res.status(400).json(errors);
        }
        res.json(profile);
    })
    .catch(err => res.status(404).json({ profile: 'there is no profile for this user' }))
})

// api/profile/user/:user_id
// get profile by user id
// Public access 

router.get('/user/:user_id' , ( req, res ) => {
    const errors = {} // initiallizing error handler
    Profile.findOne({ user: req.parmas.user })
    .populate('user' , [' name ', 'avatar '])
    .then(profile => {
        if(!profile) {
            errors.noprofile = 'There is no profile for this user '
            res.status(400).json(errors);
        }
        res.json(profile);
    })
    .catch(err => res.status(404).json(err))
})

// api/profile/user/:user_id
// get profile by user id
// Public access 
router.get('/all' , ( req, res ) => {
    const errors = {}
    Profile.find()
    .populate('user' , [' name ', 'avatar '])
    .then(profiles => {
        if(!profiles){
            errors.noprofile = 'There is no profile for this user '
            res.status(400).json(errors)
        }
        res.json(profiles);
    })
    .catch(err => {
        res.staus(404).json({ profile: 'There are no Profiles '})
    })
})



// @get api/profile
// @get current users profile
// @acess Private 

// bring in passport since it is a protected route 
router.get( '/', passport.authenticate('jwt' , {sesion: false }), (req,res) => {
    
    const errors = {};

    Profile.findOne({ user: req.user.id })
    .populate('User' , ['name' , 'avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = 'There is no Profile for this user '
            return res.status(404).json(errors);
        }
        res.json(profile)
    })
    .catch(err => res.status(404).json(err))
})

// @POST api/profile/
// @get create users profile
// @acess Private 

// bring in passport since it is a protected route 
router.post( '/', passport.authenticate('jwt' , {sesion: false }), 
(req,res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //check Validation
    if(!isValid) {
        //return any errors with 400 status 
        return res.status(400).json(errors)
    }


 // get fields 
    const profileFields = {};
    profileFields.user = req.user.id;
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // Skills - spilt into array 
if(typeof req.body.skills !== 'undefined' ){
    profileFields.skills = req.body.skills.split(',')
}
    // Social 
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twiter) profileFields.social.twiter = req.body.twiter;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
    .then(profile => {
        if(profile){
            //Update
            Profile.findOneAndUpdate(
                { user: req.user.id }, 
                { $set: profileFields }, 
                { new: true}
                ).then(profile => res.json(profile));
        }else {
            //create
            Profile.findOne({ handle: profileFields.handle }).then(profile => {
                if(profile){
                    errors.handle = 'That Handle already exists';
                    res.status(400).json(errors)
                }

                // save profile
                new Profile(profileFields).save().then(profile => res.json(profile))
            })
            // 
        }
    })
});


// @ post req api/profile/experince
// @ add experince to profile 
// @ private route
    router.post('/experince' , passport.authenticate('jwt' ,  { session:false }), ( req, res ) => {
        
        const { errors, isValid } = validateExperienceInput(req.body);

        //check Validation
        if(!isValid) {
            //return any errors with 400 status 
            return res.status(400).json(errors)
        }

        Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.comapny,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //add to exp array 
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile)); 
        })
    })

    router.post('/education' , passport.authenticate('jwt' ,  { session:false }), ( req, res ) => {
        
        const { errors, isValid } = validateEducationInput(req.body);

        //check Validation
        if(!isValid) {
            //return any errors with 400 status 
            return res.status(400).json(errors)
        }

        Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            }

            //add to exp array 
            profile.education.unshift(newEdu);

            profile.save().then(profile => res.json(profile)); 
        })
    })

    // @route delete api/profile/experince
    // @desc delete experince from profile
    // @access Private

    router.delete('/experince/:exp_id' , passport.authenticate('jwt' ,  { session:false }), ( req, res ) => {
        
        Profile.findOne({ user: req.user.id })
        .then(profile => {
          //Get remove index
          const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

            //Splice out of array
            profile.experience.splice(removeIndex,1);
        
            //save
            Profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    })
// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
    '/education/:edu_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Profile.findOne({ user: req.user.id })
        .then(profile => {
          // Get remove index
          const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);
  
          // Splice out of array
          profile.education.splice(removeIndex, 1);
  
          // Save
          profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
  );

module.exports = router;
