const ShopModel = require('../models/shop.model')

const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    name: 1,
    status: 1,
    roles: 1,
  },
}) => {
  return await ShopModel.findOne({ email: email }).select(select)
}

module.exports = {
  findByEmail,
}
