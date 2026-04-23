require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const authroutes = require('./routes/authroutes.js')
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/auth', authroutes)
const dburi = process.env.MONGOURI
mongoose.connect(dburi)
const portnum = process.env.PORT || 5000
app.listen(portnum, () => console.log('Server running on port ' + portnum))