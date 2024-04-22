import {Logger, LoggerLevel, noopLogger} from "./Logger";

/** 日志工厂 */
export interface LoggerFactory {
  configure(categories: Record<string, LoggerLevel>): void;

  configure(category: string, level: LoggerLevel): void;

  /** 默认使用根分类 */
  getLogger(category?: string): Logger;
}

/** 根分类 */
export const CATEGORY_ROOT: string = "ROOT";

/** 配置日志分类 TODO 待实现 */
export type configureLoggerCategories = (loggerFactory: LoggerFactory, categoriesLocation: string) => void

class NoopLoggerFactory implements LoggerFactory {

  configure(_categories: Record<string, LoggerLevel> | string, _level?: LoggerLevel): void {
  }

  getLogger(_category?: string): Logger {
    return noopLogger;
  }

}

export const noopLoggerFactory = new NoopLoggerFactory();
