const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic } = require('../models/product.model')

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case 'Clothing':
        return new Clothing(payload)
      case 'Electronics':
        return new Electronics(payload)
      default:
        throw new BadRequestError(`Invalid product type: ${type}`)
    }
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id })
    return newProduct
  }
}

//define sub class for different product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newClothing) throw BadRequestError('Create clothing error')

    const newProduct = await super.createProduct()
    if (!newProduct) throw BadRequestError('Create product error')

    return newProduct
  }
}
//define sub class for different product types clothing
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newElectronic) throw BadRequestError('Create electronic error')

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) throw BadRequestError('Create product error')

    return newProduct
  }
}

module.exports = ProductFactory
