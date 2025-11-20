const KeyTokenModel = require('../models/keytoken.model')
const { Types } = require('mongoose')

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    try {
      // const token = await KeyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // })

      // return token ? token.publicKeyString : null

      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = { upsert: true, new: true }

      const tokens = await KeyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      )

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static async findByUserId(userId) {
    return await KeyTokenModel.findOne({ user: new Types.ObjectId(userId) })
  }

  async removeKeyById(id) {
    const delKey = await KeyTokenModel.remove(id)
    return delKey
  }
}
module.exports = KeyTokenService
