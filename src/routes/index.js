const express = require('express')
const { apikey, permission } = require('../auth/checkAuth')
const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!')
})

//check apiKey

//check permission

router.use(apikey)
router.use(permission('0000'))

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))

module.exports = router
