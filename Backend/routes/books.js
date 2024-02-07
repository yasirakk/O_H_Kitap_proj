const express = require('express')
const router = express.Router()

const { getAllBooks, getBook, addBooks, addBook, updateBook, deleteBook } = require('../controllers/books')

router.route('/').get(getAllBooks).post(addBook)
router.route('/:id').get(getBook).put(updateBook).delete(deleteBook)
router.route('/addAll').post(addBooks)


module.exports = router