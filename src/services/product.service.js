const { BadRequestError } = require('../core/error.response')
const {
  product,
  clothing,
  electronic,
  furniture,
} = require('../models/product.model')
const { insertInventory } = require('../models/repositories/inventory.repo')
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishedForShop,
  queryProduct,
  unpublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require('../models/repositories/product.repo')

class ProductFactory {
  static registerProductType(type) {
    switch (type) {
      case 'Clothing':
        return Clothing
      case 'Electronics':
        return Electronics
      case 'Furnitures':
        return Furnitures
      default:
        throw new BadRequestError(`Invalid product type: ${type}`)
    }
  }

  static async createProduct(productType, payload) {
    const Strategy = this.registerProductType(productType)
    return new Strategy(payload).createProduct()
  }

  static async updateProduct(productType, payload) {
    const Strategy = this.registerProductType(productType)
    return new Strategy(payload).updateProduct(payload.product_id, payload)
  }

  //publish
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id })
  }

  static async unpublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({ product_shop, product_id })
  }

  //query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    return queryProduct({
      query: { product_shop, isDraft: true },
      limit,
      skip,
    })
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    return queryProduct({
      query: { product_shop, isDraft: false },
      limit,
      skip,
    })
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch })
  }

  static async findAllProducts({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_thumb'],
    })
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] })
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

    if (newProduct) {
      //add inventory
      await insertInventory({
        productId: newProduct._id,
        stockId: this.product_shop,
        stock: this.product_quantity,
        location: this.product_attributes?.location,
      })
    }

    return newProduct
  }

  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product,
    })
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

  async updateProduct(productId) {
    /**
     *
     */

    const objectParams = this

    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: objectParams,
        model: clothing,
        isNew: false,
      })
    }

    const updateProduct = await super.updateProduct(productId, objectParams)
    return updateProduct
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

class Furnitures extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    })
    if (!newFurniture) throw BadRequestError('Create furniture error')
    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) throw BadRequestError('Create product error')

    return newProduct
  }
}

module.exports = ProductFactory
