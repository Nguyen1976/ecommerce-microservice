const accessService = require('../services/access.service')

class AccessController {
  async signUp(req, res, next) {
    try {
      const newShop = await accessService.signUp(req.body)
      res.status(201).json(newShop)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AccessController()
