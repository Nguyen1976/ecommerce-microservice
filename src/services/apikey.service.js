const ApiKeyModel = require('../models/apiKey.model')
const crypto = require('crypto')

const findById = async (key) => {
  const objKey = await ApiKeyModel.findOne({
    key: key,
    status: true,
  })
  return objKey
}

module.exports = {
  findById,
}
