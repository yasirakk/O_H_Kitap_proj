const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "isim boş bırakılamaz"],
        maxlength: [100, "isim en fazla 100 karakter olabilir"]
    },
    author: {
        type: String,
        required: [true, "yazar boş bırakılamaz"],
        maxlength: [100, "yazar en fazla 100 karakter olabilir"]
    },
    publishYear: {
        type: Number,
        min: [1453, "Yayın tarihi 1453'ten sonra olmalıdır"],
        max: [2021, "Yayın tarihi 2021'den önce olmalıdır"]
    },
    barcode: {
        type: String,
        required: [true, "barkod boş bırakılamaz"],
        unique: true
    },
    publisher: {
        type: String,
        required: [true, "yayınevi boş bırakılamaz"],
        maxlength: [50, "yayınevi en fazla 50 karakter olabilir"]
    },
    stock: {
        type: Number,
        required: [true, "stok boş bırakılamaz"],
        min: [1, "Stok birden az olamaz"]
    },
    price: {
        type: Number,
        required: [true, "fiyat boş bırakılamaz"],
        min: [5, "Fiyat beşten az olamaz"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);