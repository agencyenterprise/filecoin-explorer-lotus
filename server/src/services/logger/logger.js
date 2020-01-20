import { dump } from 'dumper.js'
import winston from 'winston'
import Transport from 'winston-transport'

class ObjectDumpTransport extends Transport {
  log(info, callback) {
    const dumpObject = info.level === 'debug'

    if (dumpObject) {
      dump(info.message)
    }

    callback()
  }
}

const logger = winston.createLogger({
  format: winston.format.json(),
  level: process.env.LOG_LEVEL || 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new ObjectDumpTransport())
}

export { logger }
