'use-strict'

const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'

var apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: { type: Boolean, default: true },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222'],
    },
    createdAt: { type: Date, default: Date.now, expires: '30d' },
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const ApiKeyModel = mongoose.model(DOCUMENT_NAME, apiKeySchema)
module.exports = ApiKeyModel
