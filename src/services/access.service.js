const ShopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { crateTokenPair } = require('../auth/authUtils')
const { getInfoData } = require('../utils')

const RoleShop = {
  SHOP: 'SHOP',
  WRITTER: 'WRITTER',
  EDITER: 'EDITOR',
  ADMIN: 'ADMIN',
}

class AccessService {
  async signUp({ name, email, password }) {
    try {
      const existsingShop = await ShopModel.findOne({ email })
      if (existsingShop) {
        throw new Error('Shop with this email already exists')
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
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ['_id', 'name', 'email', 'roles'],
            object: newShop,
          }),
          tokens,
        },
      }
    } catch (error) {
      throw error
    }
  }
}

module.exports = new AccessService()
