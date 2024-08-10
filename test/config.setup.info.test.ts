import "../src/config.setup"
import {loggerFactory} from "../src";

describe('config.setup', () => {
  it('info', () => {
    loggerFactory.getLogger().info("info");
    loggerFactory.getLogger().debug("debug");
  });
});

