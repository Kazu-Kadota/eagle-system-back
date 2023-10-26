export default class ErrorHandler extends Error {
  isTreated: boolean
  code: number
  details?: any[]

  constructor (message: string, code: number, details?: any[]) {
    super(message)

    this.isTreated = true
    this.message = message
    this.code = code
    this.details = details

    Object.setPrototypeOf(this, ErrorHandler.prototype)
  }

  getDetails () {
    if (!this.details) {
      return {}
    }

    return {
      details: this.details,
    }
  }

  toObject () {
    return {
      name: this.message,
      ...this.getDetails(),
      error: {
        code: this.code,
        message: this.message,
        ...this.getDetails(),
      },
    }
  }
}
