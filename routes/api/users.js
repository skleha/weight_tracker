const express = require("express");
const router = express.Router();
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');




// Test route
router.get("/test", (req, res) => res.json({msg: "this is the users route"}))


// Registration route
router.post("/register", (req, res) => {

  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = "A user has already registered with this address";
        return res.status(400).json(errors)
      } else {        
        const newUser = new User({
          handle: req.body.handle,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
  
                const payload = { id: user.id, handle: user.handle };
                
                jwt.sign(
                  payload,
                  keys.secretOrKey,
                  { expiresIn: 3600 }, // number of seconds the key is valid
                  (err, token) => {
                    res.json({
                      success: true,
                      token: 'Bearer ' + token
                    });
                  });
                })
              .catch(err => res.json(err));
          });
        });
      }
    });
});


// Login route
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    
    // Couldn't find the email entered
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    
    // Check for correct password
    bcrypt.compare(password, user.password)
      .then(isMatch => {
        if (isMatch) {
          const payload = {id: user.id, handle: user.handle};

          // Correct password, send token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {expiresIn: 3600}, // number of seconds the key is valid
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              });
            });
      } else {
        errors.password = "Incorrect password";
        return res.status(400).json(errors);
      }   
    });
  });
});

module.exports = router;
