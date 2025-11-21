const express = require('express')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const productController = require('../../controllers/product.controller')
const router = express.Router()

router.use(authenticationV2)
/////
router.post('/', asyncHandler(productController.createProduct))

module.exports = router
