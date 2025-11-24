
class ErrorResponse extends Error {
  statusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
  }
  
  ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'Conflict error',
  }
  
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = this.ReasonStatusCode.CONFLICT,
    statusCode = this.statusCode.CONFLICT
  ) {
    super(message, statusCode)
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = this.ReasonStatusCode.FORBIDDEN,
    statusCode = this.statusCode.FORBIDDEN
  ) {
    super(message, statusCode)
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  ErrorResponse,
}
