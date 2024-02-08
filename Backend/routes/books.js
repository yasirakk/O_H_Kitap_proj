const express = require('express')
const router = express.Router()

const authenticationMiddleware = require('../middleware/auth')
const { getAllBooks, getBook, addBooks, addBook, updateBook, deleteBook, login, cokGizli } = require('../controllers/books')

router.route('/').get(getAllBooks).post(addBook)
router.route('/bilgilerim').get(authenticationMiddleware, cokGizli)
router.route('/:id').get(getBook).put(updateBook).delete(deleteBook)
router.route('/addAll').post(addBooks)
router.route('/giris').post(login)


module.exports = router