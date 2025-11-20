'use-strict'

const mongoose = require('mongoose')
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'keys'

var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    publicKey: { type: String, required: true },
    privateKey: { type: String, required: true },
    refreshTokenUsed: { type: Array, required: true, default: [] },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true, collection: COLLECTION_NAME }
)

const KeyTokenModel = mongoose.model(DOCUMENT_NAME, keyTokenSchema)
module.exports = KeyTokenModel
