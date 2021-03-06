'use strict';

const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secretFile');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: 'http://ec2-18-219-90-242.us-east-2.compute.amazonaws.com/auth/google/callback',
    passReqToCallback: true
    
}, (req, accessToken, refreshToken, profile, done) => {
    User.findOne({google:profile.id}, (err, user) => {
        if(err){
           return done(err);
        }
        
        if(user){
            req.session.user=user;
            return done(null, user);
        }else{
            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile._json.image.url;
            
            newUser.save((err) => {
                if(err){
                    return done(err)
                }
                req.session.user=newUser;
                //console.log("req.user inside google",req.user);
                return done(null, newUser);
            })
        }
    })
}));































