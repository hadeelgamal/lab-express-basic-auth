const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const saltRounds = 10;

const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('./route-gaurd');

// Signup
router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res) =>{
    console.log(req.body)

const { username, email, password } = req.body;

bcrypt.hash(password, saltRounds) // Generate a hash password  
    .then(hash => {
        return User.create({ username, email, passwordHash: hash}) // // Create a User in the DB, add the Hash password to the new user
    })
    .then(newUser => res.redirect(`/auth/profile/${newUser.username}`))// Redirect the user to their profile
    .catch(err => console.log(err))

})

// Get Login page
router.get("/login",  (req, res) => {
    console.log('SESSION =====> ', req.session);
    res.render("auth/login")
})

// Post Login
router.post("/login",  (req, res) => {
    console.log('SESSION =====> ', req.session);
    const { email, password } = req.body;
 
//    Data validation check 
  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please enter both, email and password to login.'
    });
    return;
  }


  User.findOne({ email })
    .then(user => { // --> { username: '', email: '', password: ''} || null
        console.log('user', user)
      if (!user) { // if user is not found in the DB
        res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcrypt.compareSync(password, user.passwordHash)) { // if password is correct
        // res.redirect(`/auth/profile/${user.username}`)
        // res.render('auth/profile', user);
        const { username, email } = user;
        req.session.currentUser = { username, email }; // creating the property currentUser 
        res.redirect('/auth/profile')
        
      } else { // if password is incorect
        res.render('auth/login', { errorMessage: 'Incorrect password.' });
      }
    })
    .catch(error => console.log(error));
})

// Profile route
// router.get('/profile/:username', (req, res) => {
//     const { username } = req.params;
       
//     User.findOne({ username })
//         .then(foundUser => res.render('auth/profile', foundUser))
//         .catch(err => console.log(err))

    
// })

router.get("/profile", (req, res) => {
    // console.log('currentUser:', req.session.currentUser);
    const { currentUser } = req.session;
    res.render("auth/profile", currentUser)

})

router.post('/logout', isLoggedIn, (req, res) => {
    req.session.destroy(err => {
      if (err) console.log(err);
      res.redirect('/');
    });
  });

module.exports = router;