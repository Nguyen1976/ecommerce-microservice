'use-strict'

const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'products'

var productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop'
    },
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
     product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop'
    },
  },
  {
    collection: 'clothes',
    timestamps: true,
  }
)

const electronicSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
     product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop'
    },
  },
  {
    collection: 'electronics',
    timestamps: true,
  }
)

module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  clothing: mongoose.model('Clothing', clothingSchema),
  electronic: mongoose.model('Electronic', electronicSchema),
}
