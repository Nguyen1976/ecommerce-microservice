const { BadRequestError } = require('../core/error.response')
const DiscountModel = require('../models/discount.model')
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
} = require('../models/repositories/discount.repo')
const { findAllProducts } = require('../models/repositories/product.repo')
const { convertToObjectIdMongodb } = require('../utils')

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload

    //kiểm tra
    if (
      new Date() < new Date(start_date) ||
      new Date(start_date) > new Date(end_date)
    ) {
      throw new BadRequestError('Discount code has expired')
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Start date must be before end date')
    }

    //create index for discount code
    let foundDiscount = await checkDiscountExists(DiscountModel, {
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount code already exists')
    }

    const newDiscount = await DiscountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: convertToObjectIdMongodb(shopId),
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'specific' ? product_ids : [],
    })

    return newDiscount
  }

  static async updateDiscountCode() {}

  /**
   * Get discount code by code and shopId
   */

  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit = 50,
    page = 1,
  }) {
    let foundDiscount = await checkDiscountExists(DiscountModel, {
      discount_code: code,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount code not found or inactive')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount
    let products

    if (discount_applies_to === 'all') {
      //get all product
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      })
    }

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        filter: {
          _id: {
            $in: discount_product_ids.map((id) => convertToObjectIdMongodb(id)),
          },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: 'ctime',
        select: ['product_name'],
      })
    }

    return products
  }

  /**
   *
   */
  static async getAllDiscountCodesByShop({ limit = 50, page = 1, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ['__v', 'discount_shopId'],
      model: DiscountModel,
    })
    return discounts
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    let foundDiscount = await checkDiscountExists(DiscountModel, {
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })

    if (!foundDiscount) throw new BadRequestError('Discount code not found')

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_start_date,
      discount_end_date,
      discount_type,
      discount_value,
    } = foundDiscount
    if (!discount_is_active) throw new BadRequestError('Discount expired')
    if (!discount_max_uses) throw new BadRequestError('Discount are out')

    // if (
    //   new Date() < new Date(discount_start_date) ||
    //   new Date() > new Date(discount_end_date)
    // )
    //   throw new BadRequestError('Discount code not valid now')

    let totalOrder = 0
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity
      }, 0)

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          `Order must be at least ${discount_min_order_value} to use this discount`
        )
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_users_used.find(
        (user) => user.userId === userId
      )

      if (userUserDiscount) {
        //...
      }
    }

    const amount =
      discount_type === 'fixed_amount'
        ? discount_value
        : totalOrder * (discount_value / 100)

    return { totalOrder, totalPrice: totalOrder - amount, discount: amount }
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await DiscountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })

    return deleted
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists(DiscountModel, {
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    })

    if (!foundDiscount) throw new BadRequestError('Discount code not found')

    const result = await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    })

    return result
  }
}

module.exports = DiscountService
