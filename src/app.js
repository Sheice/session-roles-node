const express = require('express');
const morgan = require('morgan');
const createRoles = require('./libs/createRoles');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
createRoles();

// config multer
const storage = multer.diskStorage({
    destination: path.join(__dirname + '/images/'),
    filename : function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname))
      },
})

// settings
app.set('port', process.env.PORT || 4000);

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(multer({
    storage
}).single('image'));

// routes
app.use('/api/movies', require('./routes/Movies'));
app.use('/api/auth', require('./routes/Auth'));
app.use('/api/users', require('./routes/Users'));


module.exports = app;