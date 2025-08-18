import moment from "moment";
import { createLogger, format, transports } from "winston";
import { EnvLoader } from '../config/env-loader';

const { combine, timestamp, printf } = format;

const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

 
export const Logger = createLogger({
  level: EnvLoader.get('LOG_LEVEL', 'info'),
  format: combine(
    timestamp({ format: () => moment().format("ddd, DD MMM YYYY HH:mm:ss") }),
    loggerFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        format.colorize(),
        loggerFormat
      )
    }),
  ],
});
