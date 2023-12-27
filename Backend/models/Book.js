/*
    {
    "title": "Birinci Kitap",
    "author": "Yasir",
    "publishYear": 1992,
    "barcode": "bizimki",
    "publisher": "Nebevi Yayinevi",
    "stock": 40,
    "price": 55
    }
*/
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
        min: [1900, "Yayın tarihi 1900'den eski olmamalıdır"]
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