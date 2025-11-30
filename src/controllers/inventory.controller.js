const { SuccessResponse } = require('../core/success.response')

class InventoryController {
  async addStock(req, res, next) {
    new SuccessResponse({
      message: 'Stock added successfully',
      metadata: await InventoryService.addStockToInventory({
        ...req.body,
      }),
    })
  }
}

module.exports = new InventoryController()
