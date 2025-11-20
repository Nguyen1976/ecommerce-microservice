const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
//init db
require('./dbs/init.mongodb')

//init middleware
const app = express()
app.use(morgan('dev'))

app.use(helmet())
app.use(compression())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('', require('./routes'))

//handle errror
app.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
app.use((error, req, res, next) => {
  const statusCode = error.status || 500
  res.status(statusCode).json({
    message: error.message || 'Internal Server Error',
    code: error.status,
    status: 'error',
  })
})

module.exports = app
