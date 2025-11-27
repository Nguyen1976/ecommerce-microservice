'use-strict'

const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

var inventorySchema = new mongoose.Schema(
  {
    inven_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    inven_location: { type: String, default: 'unKnow' },
    inven_stock: { type: Number, required: true },
    inven_shopId: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
    },
    inven_reservations: { type: Array, default: [] },
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

module.exports = { inventory: mongoose.model(DOCUMENT_NAME, inventorySchema) }
