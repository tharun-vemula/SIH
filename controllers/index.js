const Post = require('../models/post');

const POSTS_PER_PAGE = 10;
exports.getHome = (req , res) => {
    const page = +req.query.page || 1;
    let totalPosts;

    Post.find()
        .countDocuments()
        .then(numPosts => {
            totalPosts = numPosts;
            return Post.find()
            .sort({ createdAt: 'desc'})
            .skip((page - 1) * POSTS_PER_PAGE)
            .limit(POSTS_PER_PAGE);
           
        })
        .then(posts => {
            res.render('posts/index', {
                posts: posts, pageTitle : 'Raven', 
                user: req.session.user,
                currentPage: page,
                hasNextPage: POSTS_PER_PAGE * page < totalPosts,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalPosts / POSTS_PER_PAGE)
            });
        })
        .catch(err => {
            console.log(err);
        })
    
}

exports.compose = (req, res) => {
    res.render('posts/compose', {pageTitle : 'Compose', user: req.session.user});
}

