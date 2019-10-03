var express = require("express");
var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var LinkedInStrategy = require("passport-linkedin");
var secret = require('../secret/secret');

var app = express();

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});


passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({'email':email}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            return done(null, false, req.flash('error', 'User With Email Already Exist.'));
        }

        var newUser = new User();
        newUser.fullname = req.body.fullname;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
            return done(null, newUser);
        });
    })
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {

    User.findOne({'email':email}, (err, user) => {
        if(err){
            return done(err);
        }
        
        var messages = [];
        
        if(!user || !user.validPassword(password)){
            messages.push('Email Does Not Exist Or Password is Invalid')
            return done(null, false, req.flash('error', messages));
        }
        
        return done(null, user); 
    });
}));

passport.use(new FacebookStrategy(secret.facebook, (req, token, refreshToken, profile, done) => {
    User.findOne({facebook:profile.id}, (err, user) => {
        if(err){
            return done(err);
        }

        if(user){
            done(null, user);
        }else{
            var newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.email = profile._json.email;
            newUser.tokens.push({token:token});

            newUser.save(function(err) {
                if(err){
                    console.log(err);
                }
                done(null, newUser);
            });
        }
    })
}));




// LINKEDIN_API_KEY = "817x9mwaj2f7fc";
// LINKEDIN_SECRET_KEY = "DxczzjGX0OiFZRQl";


// passport.use(new LinkedInStrategy({
//     consumerKey: LINKEDIN_API_KEY,
//     consumerSecret: LINKEDIN_SECRET_KEY,
//     callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
//     profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
//   },
//   function(token, tokenSecret, profile, profileFields ,done) {
//     console.log("==========================");
//     console.log(profileFields);
//     console.log("============================");
//     //console.log(profile);
//     profilename = profileFields.displayName;
//     linkedinId = profileFields.id;
//     profile.token = token;
//     profile.tokenSecret = tokenSecret;
//     console.log(linkedinId);
//     console.log(profile.token);
//     var data = {linkedinId : linkedinId , name : profileFields.displayName, headline : profileFields._json.headline, email : profileFields._json.emailAddress ,  token : profile.token};
//          // User.create( data, function(err,user){
//          //   if(err)
//          //   {
//          //    console.log(err);
//          //   }else{
//          //    console.log("data is inserted");
//          //    console.log(user);
//          //    return done(err, user);
//          //    console.log(user);
//          //   }
//          // });
//       } 
// ));



























