const JWT = require('jsonwebtoken')
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
    console.log(error)
  }
}

module.exports = {
  crateTokenPair,
}
