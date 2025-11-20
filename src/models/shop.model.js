'use-strict'

const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'shops'

var shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    verify: { type: Boolean, default: false },
    roles: { type: Array, default: [] },
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const ShopModel = mongoose.model(DOCUMENT_NAME, shopSchema)
module.exports = ShopModel
