const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!')
})

router.use('/v1/api', require('./access'))

module.exports = router
