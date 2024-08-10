import {consoleLogger} from '../src';
import {loadLoggerConfig} from "../src";

describe('config', () => {
  it('loadLoggerConfig', () => {
    const config = loadLoggerConfig();
    consoleLogger.info("config:", config);
    expect(config).toBeDefined();
  });
});

