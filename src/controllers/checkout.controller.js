const { SuccessReponse } = require('../core/success.response')

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessReponse({
      message: 'Checkout review successfully',
      metadata: await CheckoutService.checkoutReview(req.body),
    })
  }
}

module.exports = new CheckoutController()
