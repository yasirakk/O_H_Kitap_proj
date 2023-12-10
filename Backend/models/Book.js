const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        cast: false
    },
    author: {
        type: String,
        required: true,
        cast: false
    },
    publishYear: {
        type: Number,
        cast: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);

