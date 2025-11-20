const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
require('./dbs/init.mongodb')

//init middleware
const app = express()
app.use(morgan('dev'))

app.use(helmet())
app.use(compression())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('', require('./routes'))

//init db

//handle errror

module.exports = app
