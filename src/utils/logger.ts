import winston from "winston";

const logLevel = (process.env.LOG_LEVEL as winston.LoggerOptions["level"]) || "info";

export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level} ${message}`)
  ),
  transports: [new winston.transports.Console()],
});