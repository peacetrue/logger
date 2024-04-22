import {CATEGORY_ROOT, consoleLoggerFactory, DEFAULT_LOGGER_LEVEL} from "../src";
/*
//tag::import[]
import {CATEGORY_ROOT, consoleLoggerFactory, DEFAULT_LOGGER_LEVEL} from "peacetrue-logger";

//end::import[]
*/
describe('DefaultLoggerFactory.getLogger', () => {
  it('DEFAULT_LOGGER_LEVEL', () => {
//tag::basic[]
    //获取根分类日志，根分类日志对所有日志生效，默认级别为 INFO
    expect(consoleLoggerFactory.getLogger()).toEqual(consoleLoggerFactory.getLogger(CATEGORY_ROOT));
    expect(consoleLoggerFactory.getLogger().level).toEqual(DEFAULT_LOGGER_LEVEL);
    // 未配置 App 分类，默认使用根分类
    expect(consoleLoggerFactory.getLogger("App").level).toEqual(DEFAULT_LOGGER_LEVEL);
    // 配置后使用指定的，此处按前缀匹配
    consoleLoggerFactory.configure("App", "DEBUG");
    expect(consoleLoggerFactory.getLogger("App").level).toEqual("DEBUG");
    expect(consoleLoggerFactory.getLogger("App.render").level).toEqual("DEBUG");
    // 使用匹配程度更高的
    consoleLoggerFactory.configure("App.render", "WARN");
    expect(consoleLoggerFactory.getLogger("App.render").level).toEqual("WARN");
//end::basic[]
  });
  it('cache', () => {
    expect(consoleLoggerFactory.getLogger()).toEqual(consoleLoggerFactory.getLogger());
  });
});
