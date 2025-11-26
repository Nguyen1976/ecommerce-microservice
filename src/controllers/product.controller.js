const { SuccessResponse } = require('../core/success.response')
const { product } = require('../models/product.model')
const ProductFactory = require('../services/product.service')

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'get token successfully',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res)
  }

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update product successfully',
      metadata: await ProductFactory.updateProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
        product_id: req.params.product_id,
      }),
    }).send(res)
  }

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Publish product successfully',
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res)
  }

  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Unpublish product successfully',
      metadata: await ProductFactory.unpublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res)
  }

  //query
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list drafts for shop successfully',
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
        limit: req.query.limit,
        skip: req.query.skip,
      }),
    }).send(res)
  }

  getAllPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list published for shop successfully',
      metadata: await ProductFactory.findAllPublishedForShop({
        product_shop: req.user.userId,
        limit: req.query.limit,
        skip: req.query.skip,
      }),
    }).send(res)
  }

  getListSearchProductByUser = async (req, res, next) => {
    console.log('keySearch', req.params.keySearch)
    new SuccessResponse({
      message: 'Get list search products successfully',
      metadata: await ProductFactory.searchProducts(req.params),
    }).send(res)
  }

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list products successfully',
      metadata: await ProductFactory.findAllProducts(req.query),
    }).send(res)
  }

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get product detail successfully',
      metadata: await ProductFactory.findProduct({
        product_id: req.params.product_id,
        unSelect: req.query.unSelect,
      }),
    }).send(res)
  }
}

module.exports = new ProductController()
