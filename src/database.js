const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authentications')
    .then(db => console.log('DB is connected'))
    .catch(err => console.error(err))

module.exports = mongoose;