const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/asyncHandler')
const { BadRequestError, ErrorResponse } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-refresh-token',
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
const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]
  if (!userId) {
    throw new ErrorResponse('Invalid request', 403)
  }

  const keyStore = await KeyTokenService.findByUserId(userId)

  if (!keyStore) {
    throw new ErrorResponse('Invalid user', 404)
  }

  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
      const decodeUser = JWT.verify(refreshToken, keyStore.publicKey, {
        algorithms: ['RS256'],
      })
      if (userId !== decodeUser.userId) {
        throw new BadRequestError('Invalid user token')
      }
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      console.log('Error verify access token', error)
      throw error
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) {
    throw new BadRequestError('Invalid access token')
  }

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

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  crateTokenPair,
  authentication,
  verifyJWT,
  authenticationV2,
}
