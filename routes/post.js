const express = require('express');
const postController = require('../controllers/post');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/compose', isAuth ,postController.getCompose);

router.get('/post/:id', postController.viewPost);

router.get('/download/:id', postController.download);

router.post('/compose', isAuth ,postController.postCompose);

router.post('/submit', isAuth ,postController.submitCompose );

router.post('/review',isAuth , postController.reviewCompose );

router.get('/edit/:id', postController.editPost);

router.post('/edit/:id', isAuth ,postController.updatePost);

module.exports = router;