const express = require('express')
const { apikey, permission } = require('../auth/checkAuth')

const router = express.Router()

router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!')
})

//check apiKey
router.use(apikey)

//check permission

router.use(permission('0000'))

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/checkout', require('./checkout'))

module.exports = router
