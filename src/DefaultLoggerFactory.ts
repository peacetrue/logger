import {DEFAULT_LOGGER_LEVEL, Logger, LoggerConstructor, LoggerLevel} from "./Logger";
import {CATEGORY_ROOT, LoggerFactory} from "./LoggerFactory";

export class DefaultLoggerFactory implements LoggerFactory {

  private readonly categories: Record<string, LoggerLevel> = {
    [CATEGORY_ROOT]: DEFAULT_LOGGER_LEVEL
  };

  private readonly loggerConstructor: LoggerConstructor;

  constructor(loggerConstructor: LoggerConstructor) {
    this.loggerConstructor = loggerConstructor;
  }

  configure(category: string | Record<string, LoggerLevel>, level?: LoggerLevel): void {
    if (typeof category === "string") {
      this.categories[category] = level as LoggerLevel;
    } else {
      this.configures(category);
    }
    this.resetLevel();
  }

  private configures(categories: Record<string, LoggerLevel>): void {
    let keys = Object.keys(categories);
    for (let key of keys) {
      this.categories[key] = categories[key];
    }
  }

  private readonly loggers = new Map<string, Logger>();

  getLogger(category: string = CATEGORY_ROOT): Logger {
    let logger = this.loggers.get(category);
    if (logger) return logger;

    let level = this.findLevel(category);
    logger = this.loggerConstructor(level);
    this.loggers.set(category, logger);
    return logger;
  }

  private resetLevel() {
    this.loggers.forEach((value, key) => {
      value.level = this.findLevel(key);
    });
  }

  private findLevel(category: string) {
    let categories = this.getDescCategories();
    for (let source of categories) {
      // if (category.match(source)) return this.categories[source];
      if (category.startsWith(source)) return this.categories[source];
    }
    return this.categories[CATEGORY_ROOT];
  }

  private getDescCategories() {
    return Object.keys(this.categories)
      .sort((left, right) => right.localeCompare(left));
  }
}


