const Post = require('../models/post');


exports.getHome = (req , res) => {
    Post.find()
        .then(posts => {
            res.render('posts/index', {posts: posts, pageTitle : 'Raven', user: req.session.user});
        })
    
}

exports.compose = (req, res) => {
    res.render('posts/compose', {pageTitle : 'Compose', user: req.session.user});
}

