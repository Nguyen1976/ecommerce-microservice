const { findById } = require('../services/apikey.service')

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
}

const apikey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString()
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden',
      })
    }

    //check obj kety
    const objKey = await findById(key)
    if (!objKey) {
      return res.status(403).json({
        message: 'Forbidden',
      })
    }
    req.objKey = objKey
    next()
  } catch (error) {}
}

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: 'permission denied',
      })
    }
    const checkPermission = req.objKey.permissions.includes(permission)
    if (!checkPermission) {
      return res.status(403).json({
        message: 'permission denied',
      })
    }

    return next()
  }
}


module.exports = {
  apikey,
  permission,
}
