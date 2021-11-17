const express = require('express') // backend framework for nodejs
// body parser is included in express 
const cors = require('cors') // cross origin resource sharing
const mongoose = require('mongoose') // ODM library for MongoDB & Nodejs

require('dotenv').config() // dotenv 

// back end framework express object 
const app = express() 
const {PORT = 3001} = process.env; // also can set env variables in .env.dev

// middlewares, to be used when reaching endpoints 
app.use(express.json()) // body parser is included in recent express 
app.use(cors()) 

// Database connection
const uri = process.env.MONGO_URL
mongoose.connect(uri, { useNewUrlParser: true }) // flag to prevent error during conversion 

const dbConnection = mongoose.connection;
dbConnection.once('open', () => {
    console.log("MongoDB database working")
})

// Routes
const itemsRouter = require('./routes/items')
//const vendorsRouter = require('./routes/old/vendors.js.backup')
const userRouter = require('./routes/users')

app.use('/items', itemsRouter)
//app.use('/vendors', vendorsRouter)
app.use('/users', userRouter)

// server listen
app.listen(PORT, () => {
    console.log(`Server successfully running on ${PORT}`)
})