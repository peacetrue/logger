import {loggerFactory, switchToConsole} from "./instances";
import {consoleLogger} from "./ConsoleLogger";
import {LoggerLevel} from "./Logger";
import defaultLoggerConfig from "./logger.config";

export function loadLoggerConfig(basePath?: string | string[]): Parameters<typeof configureLogger>[0] {
  if (typeof basePath === "string") {
    try {
      return require(basePath).default;
    } catch (e) {
      return defaultLoggerConfig;
    }
  } else if (basePath instanceof Array) {
    return basePath
      .map(value => loadLoggerConfig(value))
      .reduce((previousValue, currentValue) => {
        return Object.assign(previousValue, currentValue);
      }, {});
  } else {
    basePath = process.env.LOGGER_CONFIG_PATH || './logger.config';
    return loadLoggerConfig(basePath.split(','));
  }
}

export function configureLogger(categories: Record<string, Record<string, LoggerLevel>>) {
  const env = process.env.NODE_ENV || 'development';
  switchToConsole();
  if (env in categories) {
    loggerFactory.configure(categories[env]);
  } else {
    consoleLogger.warn(`Can't found env in categories!`);
    consoleLogger.warn('env: ', env);
    consoleLogger.warn('categories: ', categories);
  }
}
