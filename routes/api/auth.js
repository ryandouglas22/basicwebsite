const express = require('express');
const router = express.Router();
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/secret");

//import User Schema
const User = require("../../models/User")
//import Profile Schema
const Profile = require("../../models/Profile")

// @type    POST
// @route   /api/auth/register
// @desc    route for registration of user
// @access  PUBLIC
router.post('/register', (req, res) => {
     //query database
     User.findOne({email: req.body.email})
          .then(user => {
               //checks if the email belongs to a current user
               if (user) {
                    return res.status(400).json({emailerror: 'Email is already registered'});
               } else {
                    //creates new user
                    const newUser = new User ({
                         name: req.body.name,
                         email: req.body.email,
                         password: req.body.password
                    });
                    //Encrypt password
                    
                    newUser.save()
                         .then(user => {
                              //creates new profile for user
                              const newProfile = new Profile ({
                                   user: user.id,
                                   name: req.body.name,
                                   email: req.body.email
                              });
                              //saves profile to database
                              newProfile.save()
                                   //sends profile to client
                                   .then(profile => res.redirect('/api/auth/login'))
                                   .catch(err => console.log(err));
                         })
                         .catch(err = console.log(err));
                    }
                         
          })
          .catch(err => console.log(err));
});

// @type    GET
// @route   /api/auth/register
// @desc    route for registration of user
// @access  PUBLIC
router.get('/register', (req, res) =>{
     res.render('register')
});

// @type    POST
// @route   /api/auth/login
// @desc    route for logging in
// @access  PUBLIC
router.post('/login', (req, res) => {
     //set vars for required fields
     const email = req.body.email;
     const password = req.body.password;
     
     //query database
     User.findOne({email})
          .then(user => {
               //checks if the email belongs to a current user
               if (!user) {
                    return res.status(400).json({emailerror: 'User not found'})
               }
               //compares password with hash
               
               res.redirect('/')
          })
          .catch(err => console.log(err));
});

// @type    GET
// @route   /api/auth/login
// @desc    route for logging in
// @access  PUBLIC
router.get('/login', (req, res) =>{
     res.render('login')
});

module.exports = router;