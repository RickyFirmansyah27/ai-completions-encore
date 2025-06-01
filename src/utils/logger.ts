import moment from "moment";
import { createLogger, format, transports } from "winston";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../../../.env');
config({ path: envPath });

const { LOGTAIL_API_KEY, LOGTAIL_ENDPOINT } = process.env;
if (!LOGTAIL_API_KEY || !LOGTAIL_ENDPOINT) {
  throw new Error("LOGTAIL_API_KEY and LOGTAIL_ENDPOINT must be set in the environment variables.");
}
const logtail = new Logtail(LOGTAIL_API_KEY, {
  endpoint: LOGTAIL_ENDPOINT,
});

const { combine, timestamp, printf } = format;

const loggerFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

export const Logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({ format: () => moment().format("ddd, DD MMM YYYY HH:mm:ss") }),
    loggerFormat
  ),
  transports: [
    new transports.Console(), // Log ke console
    new LogtailTransport(logtail), // Log ke Logtail
  ],
});
