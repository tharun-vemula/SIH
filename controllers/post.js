var mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const User = require('../models/user');

exports.submitCompose = (req, res) => {
    const title = req.body.title;
    const meta = req.body.meta;
    const content = req.body.content;
    const file = req.file;
    console.log(file);

    const post = new Post({
        title : title,
        meta : meta,
        content : content,
        createrId : req.session.user._id,
        creator: req.session.user.name
    });

    if(file == 'undefined'){
        post.postPath = null;
      
    } else {
        post.postPath = file.path;
    }
    
 

    post.save()
        .then(result => {
            console.log('post added to post db');

            User.findById(post.createrId)
                .then(user => {
                    let newPost = {postId : post._id}
                    user.contribution.posts.push(newPost);
                    user.save()
                        .then(res => {
                            console.log('post added to user');
                        })
                   
                })
           res.redirect('/');
            
        })
        .catch(err => {
            console.log(err);
        })
}


exports.getCompose = (req, res) => {
    console.log(req.session);
    res.render('posts/compose', {pageTitle : 'Compose'});
}

exports.postCompose = (req, res) => {
    res.render('posts/review', {title : req.body.title, content: req.body.content, meta : req.body.meta, file : req.file, pageTitle : 'Raven'});
}


exports.viewPost = (req, res) => {
    var id = new mongoose.Types.ObjectId(req.params.id);
    Post.findById(id)
        .then(post => {
            res.render('posts/view', {post : post, pageTitle : 'Raven'});
        })
        .catch(err => {
            console.log(err);
        })
}

exports.download = (req, res) => {
    const id = new mongoose.Types.ObjectId(req.params.id);

    Post.findById(id)
        .then(post => {

      const fileName = id + '.pdf';
      const filePath = post.postPath;
      
      const file = fs.createReadStream(filePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + fileName + '"'
      );
      file.pipe(res);
    })
    .catch(err => {
        console.log(err);
    })
}