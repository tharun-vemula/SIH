const express = require('express');
const postController = require('../controllers/post');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/compose', isAuth ,postController.getCompose);

router.get('/post/:id', postController.viewPost);

router.get('/download/:id', postController.download);

router.post('/compose', postController.postCompose);

router.post('/submit', postController.submitCompose );

router.post('/review', postController.reviewCompose );



module.exports = router;