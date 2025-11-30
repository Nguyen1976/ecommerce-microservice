'use-strict'

const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

var orderSchema = new mongoose.Schema(
  {
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, default: [] },
    order_trackingNumber: { type: String, default: '#0001' },
    order_status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'shipped', 'confirmed', 'cancelled', 'delivered'],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const OrderModel = mongoose.model(DOCUMENT_NAME, orderSchema)
module.exports = { order: OrderModel }
