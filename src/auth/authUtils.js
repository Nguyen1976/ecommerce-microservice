const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { BadRequestError, ErrorResponse } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
}

const crateTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    })
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days',
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log('Error verify access token', err)
      }
    })

    JWT.verify(refreshToken, publicKey, (err, decode) => {
      if (err) {
        console.log('Error verify refresh token', err)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    console.log('Error crate token pair', error)
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) {
    throw new ErrorResponse('Invalid request', 403)
  }

  const keyStore = await KeyTokenService.findByUserId(userId)

  if (!keyStore) {
    throw new ErrorResponse('Invalid user', 404)
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) {
    throw new BadRequestError('Invalid access token')
  }
  console.log('🚀 ~ authUtils.js:48 ~ keyStore:', keyStore.publicKey)
  console.log('🚀 ~ authUtils.js:54 ~ accessToken:', accessToken)

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey, {
      algorithms: ['RS256'],
    })
    if (userId !== decodeUser.userId) {
      throw new BadRequestError('Invalid user token')
    }
    req.keyStore = keyStore
    return next()
  } catch (error) {
    console.log('Error verify access token', error)
    throw error
  }
})

module.exports = {
  crateTokenPair,
  authentication,
}
