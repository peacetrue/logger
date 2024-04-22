import {consoleLogger, DEFAULT_LOGGER_LEVEL} from '../src';
/*
//tag::import[]
import {consoleLogger, DEFAULT_LOGGER_LEVEL} from "peacetrue-logger";

//end::import[]
*/

import {_setLocalConsole} from "../src/ConsoleLogger";
import * as fs from "fs";
// 代理 console 记录其输出的消息
const messages: string[] = [];
_setLocalConsole({
  log: function () {
    messages.push(Array.prototype.join.call(arguments, " "));
  }
})

describe('ConsoleLogger', () => {
  it('isEnabled', () => {
//@formatter:off
    //tag::basic[]
    // 默认 INFO
    expect(consoleLogger.level).toEqual(DEFAULT_LOGGER_LEVEL);
    expect(consoleLogger.isErrorEnabled()).toEqual(true);
    expect(consoleLogger.isWarnEnabled()).toEqual(true);
    expect(consoleLogger.isInfoEnabled()).toEqual(true);
    expect(consoleLogger.isDebugEnabled()).toEqual(false);
    expect(consoleLogger.isTraceEnabled()).toEqual(false);
    //end::basic[]
//@formatter:on
  });

  it('log', () => {
    //tag::basic[]

    function logs() {
      consoleLogger.error("error");
      consoleLogger.warn("warn");
      consoleLogger.info("info");
      consoleLogger.debug("debug");
      consoleLogger.trace("trace");
    }

    logs();
    //end::basic[]
    expect(messages.length).toEqual(3);
    const stream = fs.createWriteStream('test/log/console.log');
    stream.write(messages.join("\n"));
  });
});
