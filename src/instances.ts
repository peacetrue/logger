import {LoggerFactory, noopLoggerFactory} from "./LoggerFactory";
import {LoggerProxy, noopLoggerProxy} from "./LoggerProxy";
import {DefaultLoggerFactory} from "./DefaultLoggerFactory";
import {consoleLoggerConstructor} from "./ConsoleLogger";
import {DefaultLoggerProxy} from "./DefaultLoggerProxy";

export const consoleLoggerFactory = new DefaultLoggerFactory(consoleLoggerConstructor);
export const consoleLoggerProxy = new DefaultLoggerProxy(consoleLoggerFactory);

export let loggerFactory: LoggerFactory = noopLoggerFactory;
export let loggerProxy: LoggerProxy = noopLoggerProxy;

export const loggerFactoryConsumer = (factory: LoggerFactory) => {
  if (!factory) throw new Error('loggerFactory is required!');
  loggerFactory = factory;
}
export const loggerProxyConsumer = (factory: LoggerProxy) => {
  if (!factory) throw new Error('loggerProxy is required!');
  loggerProxy = factory;
}
