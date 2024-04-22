import {LoggerFactory, noopLoggerFactory} from "./LoggerFactory";
import {Logger} from "./Logger";

export type ContextLogger = (defaultLogger?: Logger) => Logger | undefined;

/** 日志代理 */
export interface LoggerProxy {
  readonly loggerFactory: LoggerFactory;

  /** 代理类上的函数，包括：静态函数、实例成员函数、实例变量函数。 */
  proxyClass<T extends Function>(clazz: T): T;

  /** 代理实例上的函数，包括：实例成员函数、实例变量函数。 */
  proxyInstance<T extends object>(instance: T, category?: string): T;

  /** 代理指定函数，包括：函数本身和函数上的静态函数。 */
  proxyFunction<T extends Function>(func: T, category?: string): T;
}

class NoopLoggerProxy implements LoggerProxy {

  loggerFactory: LoggerFactory;

  constructor(loggerFactory: LoggerFactory) {
    this.loggerFactory = loggerFactory;
  }

  proxyClass<T extends Function>(clazz: T): T {
    return clazz;
  }

  proxyInstance<T extends object>(instance: T, _category?: string): T {
    return instance;
  }

  proxyFunction<T extends Function>(func: T, _category?: string): T {
    return func;
  }

}

export const noopLoggerProxy = new NoopLoggerProxy(noopLoggerFactory);
