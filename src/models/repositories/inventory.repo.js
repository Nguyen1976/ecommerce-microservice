const { convertToObjectIdMongodb } = require('../../utils')
const { inventory } = require('../inventory.model')
const { Types } = require('mongoose')

const insertInventory = async ({
  productId,
  stockId,
  stock,
  location = 'unKnow',
}) => {
  return await inventory.create({
    inven_productId: new Types.ObjectId(productId),
    inven_shopId: new Types.ObjectId(stockId),
    inven_stock: stock,
    inven_location: location,
  })
}

const reservationInventory = async ({ productId, quantity, cardId }) => {
  const query = {
      inven_productId: convertToObjectIdMongodb(productId),
      inven_stock: {
        $gte: quantity,
      },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity,
          cardId,
          createOn: new Date(),
        },
      },
    },
    options = {
      upsert: true,
      new: true,
    }

  return await inventory.updateOne(query, updateSet, options)
}

module.exports = { insertInventory, reservationInventory }
