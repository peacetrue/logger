import {LoggerConstructor, LoggerLevel} from "../src/Logger";
import {ConsoleLogger} from "../src";
import {formatLevel} from "../src/ConsoleLogger";

export type MockMessage = {
  level: LoggerLevel,
  msg: any,
  args: any[],
}

export class MockLogger extends ConsoleLogger {
  messages: MockMessage[] = [];

  constructor(level: LoggerLevel = "TRACE") {
    super(level);
  }

  doLog(level: LoggerLevel, msg: any, ...args: any[]): void {
    this.messages.push({level, msg, args});
  }

  clear() {
    this.messages = [];
  }

  toString() {
    return this.messages.map(item => [formatLevel(item.level), item.msg, item.args.join(" ")].join(" ")).join("\n");
  }
}

export const mockLogger = new MockLogger();
export const mockLoggerConstructor: LoggerConstructor = (_level: LoggerLevel) => mockLogger;
