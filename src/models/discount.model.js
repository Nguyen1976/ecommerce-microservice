'use-strict'

const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

var discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: { type: String, required: true },
    discount_type: {
      type: String,
      required: 'fixed_amount', //perentage
    },
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true },
    discount_uses_count: { type: Number, required: true },
    discount_users_used: { type: Array, default: [] },
    discount_max_uses_per_user: { type: Number, required: true },
    discount_min_order_value: { type: Number, required: true },
    discount_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      required: true,
      enum: ['all', 'specific'],
    }, //all_products, specific_products
    discount_product_ids: { type: Array, default: [] }, //số sản phẩm được áp dụng
    discount_is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const DiscountModel = mongoose.model(DOCUMENT_NAME, discountSchema)
module.exports = DiscountModel
