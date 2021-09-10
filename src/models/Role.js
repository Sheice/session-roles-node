const {Schema, model} = require('mongoose');

const schemaRole = new Schema({
    name: String
}, {
    versionKey: false
});


module.exports = model('Role', schemaRole);