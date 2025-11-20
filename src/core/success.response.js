const { extend } = require('lodash')

const statusCode = {
  OK: 200,
  CREATED: 201,
}

const ReasonStatusCode = {
  OK: 'OK',
  CREATED: 'Created',
}

class SuccessResponse {
  constructor({
    message,
    statusCode = statusCode.OK,
    reason = ReasonStatusCode.OK,
    metadata = {},
  }) {
    this.message = message || reason
    this.status = statusCode
    this.metadata = metadata
    this.reason = reason
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this)
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      statusCode: statusCode.OK,
      reason: ReasonStatusCode.OK,
      metadata,
    })
  }
}

class Created extends SuccessResponse {
  constructor({
    message,
    statusCode = statusCode.CREATED,
    reason = ReasonStatusCode.CREATED,
    metadata,
  }) {
    super({
      message,
      statusCode,
      reason,
      metadata,
    })
  }
}

module.exports = {
  SuccessResponse,
  OK,
  Created,
}
