'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
const secret = require('../secret/secretFile');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('facebook',new FacebookStrategy({
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName'],
    callbackURL: 'http://ec2-18-219-90-242.us-east-2.compute.amazonaws.com/auth/facebook/callback',
    passReqToCallback: true
    
}, (req, token, refreshToken, profile, done) => {
    console.log("inside facebook ",profile);
    console.log("token received ",token);
    
    User.findOne({facebook:profile.id}, (err, user) => {
       if(err){
           return done(err);
       }
        
        if(user){
            req.session.user=user;
            return done(null, user);
        }else{
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = 'https://graph.facebook.com/'+profile.id+'/picture?type=large';
            newUser.fbTokens.push({token:token});
            //console.log("came here");
            
            newUser.save((err) => {
                //req.session.user=newUser;
                //req.user=newUser;

                //console.log("req.user inside facebook ",req.user);
                return done(null, newUser);

            })
        }
    })
}));































