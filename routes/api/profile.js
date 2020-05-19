const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//import User Schema
const User = require("../../models/User");
//import Profile Schema
const Profile = require("../../models/Profile");

// @type    GET
// @route   /api/profile
// @desc    route for user profile
// @access  PRIVATE
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
     //queries database for profile
     Profile.findOne({user: req.user.id})
          .then(profile => {
               //check if profile found
               if (!profile) {
                    res.status(400).json({profileerror: "Profile not found"})
               } else {
                    //send profile to client
                    res.json(profile);
               }
          })
          .catch(err => console.log(err));
});

// @type    POST
// @route   /api/profile
// @desc    route for user profile
// @access  PRIVATE
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
     const profileValues = {};
     //check if value is present and sets it
     if (req.body.name) profileValues.name = req.body.name;
     if (req.body.desc) profileValues.desc = req.body.desc;
     if (req.body.gender) profileValues.gender = req.body.gender;

     //queries database for profile
     Profile.findOneAndUpdate(
               {user: req.user.id},
               {$set: profileValues},
               {new: true}
          )    
               //sends profile to client
               .then(profile => {
                    //updates user if name changed
                    const userValues = {}
                    if (req.body.name) userValues.name = req.body.name;
                    User.findOneAndUpdate(
                         {_id: req.user.id},
                         {$set: userValues},
                         {new: true}
                    )
                         .then(res.json(profile))
                         .catch(err => console.log(err))
               })
               .catch(err => console.log(err));
          
});

module.exports = router;