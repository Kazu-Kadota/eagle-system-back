import pino from 'pino'

const LEVELS = ['debug', 'info', 'warn', 'error']

class Logger {
  config: any
  pino: pino.Logger

  constructor () {
    this.config = {}

    this.setLevel = this.setLevel.bind(this)
    this.debug = this.debug.bind(this)
    this.info = this.info.bind(this)
    this.warn = this.warn.bind(this)
    this.error = this.error.bind(this)

    this.pino = pino({
      base: null,
      timestamp: false,
      messageKey: 'message',
      formatters: {
        level: (label) => ({ level: label.toUpperCase() }),
      },
    })

    this.setLevel(process.env.LOGGER_LEVEL || LEVELS[0])
  }

  setLevel (level?: string) {
    if (level && LEVELS.includes(level)) {
      this.pino.level = level
    }
  }

  setService (service: string) {
    this.config.service = service
  }

  setUser (user_id: string) {
    this.config.user_id = user_id
  }

  setRequestId (request_id: string) {
    this.config.request_id = request_id
  }

  getConfig () {
    return {
      created_at: new Date().toISOString(),
      type: 'log',
      ...this.config,
    }
  }

  debug (log: any) {
    const config = this.getConfig()
    this.pino
      .child(config)
      .debug(log)
  }

  info (log: any) {
    const config = this.getConfig()
    this.pino
      .child(config)
      .info(log)
  }

  warn (log: any) {
    const config = this.getConfig()
    this.pino
      .child(config)
      .warn(log)
  }

  error (log: any) {
    const config = this.getConfig()
    this.pino
      .child(config)
      .error(log)
  }

  fatal (log: any) {
    const config = this.getConfig()
    this.pino
      .child(config)
      .fatal(log)
  }
}

export = new Logger()
