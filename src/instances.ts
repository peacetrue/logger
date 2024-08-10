import {LoggerFactory, noopLoggerFactory} from "./LoggerFactory";
import {LoggerProxy, noopLoggerProxy} from "./LoggerProxy";
import {consoleLoggerFactory} from "./consoleLoggerFactory";
import {consoleLoggerProxy} from "./consoleLoggerProxy";

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

export function switchToNoop() {
  loggerFactoryConsumer(noopLoggerFactory);
  loggerProxyConsumer(noopLoggerProxy);
}

export function switchToConsole() {
  loggerFactoryConsumer(consoleLoggerFactory);
  loggerProxyConsumer(consoleLoggerProxy);
}

export function disableConsole() {
  window.console = new Proxy(console, {
    get(_target, _prop) {
      return () => {
      }; // Disable all console methods
    },
  }); // Replace the original console with the proxy
}
