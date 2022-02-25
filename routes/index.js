const express = require('express');
const indexController = require('../controllers/index');
const isAuth = require('../middleware/isAuth');


const router = express.Router();

router.get('/', indexController.getHome);

router.get('/compose', isAuth ,indexController.compose);

module.exports = router;