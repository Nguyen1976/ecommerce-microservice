const { BadRequestError } = require('../core/error.response')
const { product } = require('../models/product.model')
const { findCartById } = require('../models/repositories/cart.repo')
const { checkProductByServer } = require('../models/repositories/product.repo')

class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    //check cartId ton tai khong
    const foundCart = await findCartById(cartId)
    if (!foundCart) throw new BadRequestError('Cart not found')

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = []

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i]

      const checkProductServer = await checkProductByServer(item_products)

      if (!checkProductByServer[0])
        throw new BadRequestError('Some products are not valid')

      const checkoutPrice = checkProductServer.reduce(
        (acc, curr) => acc + curr.quantity * curr.price,
        0
      )

      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      }

      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        })

        checkout_order.totalDiscount += discount

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    }
  }
}

module.exports = CheckoutService
