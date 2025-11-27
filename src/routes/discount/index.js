const express = require('express')
const accessController = require('../../controllers/discount.controller')
const asyncHandler = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const discountController = require('../../controllers/discount.controller')
const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodeWithProducts))

router.use(authenticationV2)

router.post('/', asyncHandler(discountController.createDiscount))
router.get('/', asyncHandler(discountController.getAllDiscountCodes))

module.exports = router
