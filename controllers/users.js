'use strict';

module.exports = function(_, passport, User,Users){
    
    return {
        AccessPage: function(router){
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUp);
            router.get('/forgotPassword',this.forgotPassword);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', this.facebookLogin);
            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback', this.googleLogin);
            
            
            router.post('/changePasswordAndLogin',this.changePasswordAndLogin);
            router.post('/', User.LoginValidation, this.postLogin);
            router.post('/signup', User.SignUpValidation, this.postSignUp);
        },
        
        indexPage: function(req, res){
            const errors = req.flash('error');
            return res.render('index', {title: 'Social Chat', messages: errors, hasErrors: errors.length > 0});
        },

        forgotPassword:function(req,res){
            res.render('forgotpassword');
        },


        changePasswordAndLogin:function(req,res){
            if(req.body.newPassword!=req.body.confirmPassword){
                //var myResponse=responseGenerator.generate(true,"newPassword and confirmPassword should match",400,null);
                res.send("newPassword and confirmPassword should match");
            }
            Users.findOne({'email':req.body.email},function(err,userFound){
                if(err){
                    res.send(err);
                }
                else{
                    userFound.password =userFound.encryptPassword(req.body.newPassword);
                    userFound.save(function(){
                        console.log("user after setting password ",userFound);
                        req.session.user=userFound;
                        req.user=userFound;
                        console.log("user after setting password ",userFound);
                        //delete req.session.user.password;
                        res.redirect('/');
                    });
                }
            });
        },
        
        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),
        
        getSignUp: function(req, res){
            const errors = req.flash('error');
            return res.render('signup', {title: 'Social Chat', messages: errors, hasErrors: errors.length > 0});
        },
        
        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        
        getFacebookLogin: passport.authenticate('facebook', {
           scope: 'email' 
        }),
        
        getGoogleLogin: passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
        }),
        
        googleLogin: passport.authenticate('google', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),
        
        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        })
    }
    
}















