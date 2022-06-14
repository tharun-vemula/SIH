const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');
const flash = require('connect-flash');
const {spawn} = require('child_process')

const MONGO_URI = 'mongodb://tharun:F0zvliOynvWjbrKf@cluster0-shard-00-00.iy4kk.mongodb.net:27017,cluster0-shard-00-01.iy4kk.mongodb.net:27017,cluster0-shard-00-02.iy4kk.mongodb.net:27017/sample?ssl=true&replicaSet=atlas-k2o103-shard-0&authSource=admin&retryWrites=true&w=majority';
const PORT = process.env.PORT || 3000;

const authRouter = require('./routes/auth');
const indexRouter = require('./routes/index');
const postRouter = require('./routes/post');

const app = express();
const store = new MongoDBStore({
    uri : MONGO_URI,
    collection : 'sessions',
});

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Math.floor(Math.random() * 1000) +"-"+ file.originalname)
    }
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage : fileStorage }).single('file'))
app.use(
    session({ 
        secret : 'my secret', 
        resave : false, 
        saveUninitialized : false,
        store : store})
);

 
app.use(flash());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
  });

app.get('/home', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
})

app.get('/try' , (req, res) => {
    var dataToSend;
    
    const python = spawn('python', ['./py-scripts/test-run.py']);
    
    python.stdout.on('data', function (data) {
     console.log('Pipe data from python script ...');
     dataToSend = data.toString();
    });
    
    python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    res.send(dataToSend)
    });
})

app.use(authRouter);
app.use(indexRouter);
app.use(postRouter);



mongoose
    .connect(MONGO_URI)
    .then(result => {
        app.listen(PORT, (req,res) =>{
            console.log("Running")
        });
    })
    .catch(err => {
        console.log(err);
    })
