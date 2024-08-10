import "dotenv/config"
import "../src/config.setup"
import {loggerFactory} from "../src";

describe('config.setup', () => {
  it('debug', () => {
    loggerFactory.getLogger().info("info");
    loggerFactory.getLogger().debug("debug");
  });
});

