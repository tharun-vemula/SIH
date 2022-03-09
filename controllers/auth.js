const User = require("../models/user");
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');



exports.getLogin = (req, res) => {

  if(req.session.isLoggedIn)
   res.redirect('/')

    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/login', {
      path: '/auth/login',
      pageTitle: 'Login',
      errorMessage: message,
      user : req.session.user
    });
}

exports.postLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg
        
      });
    }

    User.findOne( {email : email} )
        .then(user => {
            if(!user){
                req.flash('error', "Account doesn't exist ! Try Sign Up");
                return res.redirect('/login');  
            }

            bcrypt.compare(password, user.password)
                .then(isMatched => {
                    if(isMatched){
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        
                        return req.session.save(err => {
                            console.log("No error in login");
                            res.redirect('/');
                        });
                   }
                   req.flash('error', 'Invalid Credentials');
                    res.redirect('/login'); //validation is required
                })
        })
    
}


exports.getSignup = (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Sign Up',
      errorMessage: message
    });
}


exports.postSignup = (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
     if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      });
  }

    User.findOne( { email : email } )
        .then(userDoc => {
            if(userDoc){
                req.flash('error', 'Account already exists!');
                return res.redirect('/signup'); // validation for user already exists
            }
            
           return bcrypt.hash(password, 10)
            .then(hashedPassword => {
                const user = new User({
                    name : name,
                    email : email,
                    password : hashedPassword,
                    contribution : {posts: []}

                });

                return user.save();
            })
            .then( result => {
                res.redirect('/');
            })
                
        })
        .catch(err => {
            console.log(err);
        })
}


exports.logout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/');
    });
  };


exports.getProfile = (req, res, next ) => {
  res.render('users/profile', {user : req.session.user, pageTitle: req.session.user.name})
}