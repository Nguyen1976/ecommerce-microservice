'use-strict'

const { update } = require('lodash')
const { product, electronic, clothing, furniture } = require('../product.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData } = require('../../utils')

const publishProductByShop = async ({ product_shop, product_id }) => {
  const productFound = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  })

  if (!productFound) return null

  productFound.isDraft = false
  productFound.isPublished = true

  const { modifiedCount } = await product.updateOne(
    { _id: productFound._id },
    productFound
  )

  return modifiedCount
}

const unpublishProductByShop = async ({ product_shop, product_id }) => {
  const productFound = await product.findOne({
    _id: new Types.ObjectId(product_id),
    product_shop: new Types.ObjectId(product_shop),
  })

  if (!productFound) return null

  productFound.isDraft = true
  productFound.isPublished = false

  const { modifiedCount } = await product.updateOne(
    { _id: productFound._id },
    productFound
  )

  return modifiedCount
}

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find({ ...query })
    .populate('product_shop', '_id name email')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
}

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const results = await product
    .find(
      { isPublished: true, $text: { $search: regexSearch } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
  return results
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  console.log({ limit, sort, page, filter, select })
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: -1 }
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))

  return products
}

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect))
}

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew })
}

module.exports = {
  publishProductByShop,
  queryProduct,
  unpublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
}
