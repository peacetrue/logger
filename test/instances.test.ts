import {consoleLoggerFactory, consoleLoggerProxy, loggerFactory, loggerFactoryConsumer, loggerProxy, loggerProxyConsumer, noopLoggerFactory, noopLoggerProxy} from '../src';


describe('loggerFactory', () => {
  it('basic', () => {
    expect(loggerFactory).toEqual(noopLoggerFactory);
    loggerFactoryConsumer(consoleLoggerFactory)
    expect(loggerFactory).toEqual(consoleLoggerFactory);
  });
});

describe('loggerProxy', () => {
  it('basic', () => {
    expect(loggerProxy).toEqual(noopLoggerProxy);
    loggerProxyConsumer(consoleLoggerProxy)
    expect(loggerProxy).toEqual(consoleLoggerProxy);
  });
});
