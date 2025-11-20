const ShopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { crateTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')
const { BadRequestError, ErrorResponse } = require('../core/error.response')
const { findByEmail } = require('./shop.service')

const RoleShop = {
  SHOP: 'SHOP',
  WRITTER: 'WRITTER',
  EDITER: 'EDITOR',
  ADMIN: 'ADMIN',
}

class AccessService {
  handlerRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    )
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      )

      //xóa hết token trong store
      await KeyTokenService.deleteById(userId)

      throw new ErrorResponse('Something wrong happen. Please re-login', 403)
    }

    const holderToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    )

    if (!holderToken) {
      throw new ErrorResponse('Invalid refresh token', 403)
    }

    //verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    )

    const foundShop = await findByEmail({ email })
    if (!foundShop) {
      throw new BadRequestError('Shop not registered')
    }

    const tokens = await crateTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      holderToken.publicKey, // verify
      holderToken.privateKey // sign
    )

    await holderToken.update({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    })

    return {
      user: { userId, email },
      tokens,
    }
  }

  login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email })

    if (!foundShop) {
      throw new BadRequestError('Shop not registered')
    }

    const match = await bcrypt.compare(password, foundShop.password)
    if (!match) {
      throw new BadRequestError('Authentication failed')
    }

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    })

    const tokens = await crateTokenPair(
      {
        userId: foundShop._id,
        email,
      },
      publicKey, // verify
      privateKey // sign
    )

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey, // PEM
      privateKey, // PEM
      refreshToken: tokens.refreshToken,
    })

    return {
      code: 201,
      metadata: {
        shop: getInfoData({
          fields: ['_id', 'name', 'email', 'roles'],
          object: foundShop,
        }),
        tokens,
      },
    }
  }

  async signUp({ name, email, password }) {
    try {
      const existsingShop = await ShopModel.findOne({ email })
      if (existsingShop) {
        throw new BadRequestError('Shop already exists')
      }

      const passwordHash = await bcrypt.hash(password, 10)

      const newShop = await ShopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      })

      // ---- GENERATE RSA KEY PAIR ----
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      })

      // ---- SAVE KEY TO DB ----
      await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey, // PEM
        privateKey, // PEM
      })

      // ---- CREATE JWT TOKENS ----
      const tokens = await crateTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey, // verify
        privateKey // sign
      )

      return {
        shop: getInfoData({
          fields: ['_id', 'name', 'email', 'roles'],
          object: newShop,
        }),
        tokens,
      }
    } catch (error) {
      throw error
    }
  }

  async logout({ keyStore }) {
    //add refreshToken hiện tại vào danh sách đã sử dụng
    // await KeyTokenService.updateRefreshTokenUsed(
    //   keyStore._id,
    //   keyStore.refreshToken
    // )
    //xóa khóa khỏi database

    const delKey = await KeyTokenService.removeKeyById(keyStore._id)
    return delKey
  }
}

module.exports = new AccessService()
