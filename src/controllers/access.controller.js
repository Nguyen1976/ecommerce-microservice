const accessService = require('../services/access.service')

const { Created, SuccessResponse } = require('../core/success.response')

class AccessController {
  handlerRefreshToken = async (req, res, next) => {
    // new SuccessResponse({
    //   message: 'get token successfully',
    //   metadata: await accessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res)

    //v2 fixed, ho need access token
    new SuccessResponse({
      message: 'get token successfully',
      metadata: await accessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res)
  }

  logout = async (req, res, next) => {
    const logoutShop = await accessService.logout({
      keyStore: req.keyStore,
    })
    new SuccessResponse({
      message: 'Logout shop successfully',
      metadata: logoutShop,
    }).send(res)
  }

  login = async (req, res, next) => {
    const loginShop = await accessService.login(req.body)
    new SuccessResponse({
      message: 'Login shop successfully',
      metadata: loginShop,
      statusCode: 201,
    }).send(res)
  }

  signUp = async (req, res, next) => {
    const newShop = await accessService.signUp(req.body)
    new Created({
      message: 'Register new shop successfully',
      metadata: newShop,
    }).send(res)
  }
}

module.exports = new AccessController()
