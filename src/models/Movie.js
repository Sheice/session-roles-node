const {Schema, model} = require('mongoose');

const schemaMovie = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    author: {type: String, required: true},
    imgUrl: {type: String, required: true},
    imgIdPublic: {type: String, required: true},
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model('Movie', schemaMovie);