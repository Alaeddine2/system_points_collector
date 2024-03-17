const winston = require('winston');
const config = require('../config/config');
require('dotenv').config()

const enumerateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
});

const logger = winston.createLogger({
    level: config.LOGLVL,
    format: winston.format.combine(
      enumerateErrorFormat(),
      process.env.NODE_ENV === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
      winston.format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
      winston.format.align(),
      winston.format.printf(info => `${info.level}: ${[info.timestamp]} => ${info.message}`),
    ),
    transports: [
      new winston.transports.File({
        filename: `logs/${new Date().toISOString().slice(0,10)}.log`
      }),
    ],
});
  
module.exports = logger;