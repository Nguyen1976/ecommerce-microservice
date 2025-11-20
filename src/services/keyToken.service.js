const KeyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static async createKeyToken({ userId, publicKey, privateKey }) {
    try {
      const token = await KeyTokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      })

      return token ? token.publicKeyString : null
    } catch (error) {
      return error
    }
  }
}
module.exports = KeyTokenService
