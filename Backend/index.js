// localhost:0404
const express = require('express')
require('express-async-errors')
const app = express()
const connect = require('./db/connect_mongoose')
const books = require('./routes/books')
const notFound = require('./middleware/not-found')
const errorHandler = require('./middleware/error-handler')
require('dotenv').config()

const port = process.env.PORT || 3000

// middleware
app.use(express.json());
app.use('/api/v1/books', books)
app.use(notFound)
app.use(errorHandler)



const start = async () => {
    try {
        await connect(process.env.MONGODB_URL);
        app.listen(port, () => {
            console.log("sunucu çalışmaya başladı....." + port);
        })
    } catch (error) {
        console.log(error);
    }
}


start()