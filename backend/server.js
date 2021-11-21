const express = require('express') // backend framework for nodejs
// body parser is included in express 
const cors = require('cors') // cross origin resource sharing
const mongoose = require('mongoose') // ODM library for MongoDB & Nodejs
const path = require('path')

require('dotenv').config() // dotenv 

// back end framework express object 
// local 3001
const app = express() 
const PORT = process.env.PORT || 80; // also can set env variables in .env.dev

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

// heroku related setting

// Serve static files from the React frontend app
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
    });
  }


// server listen
app.listen(PORT, () => {
    console.log(`Server successfully running on ${PORT}`)
})