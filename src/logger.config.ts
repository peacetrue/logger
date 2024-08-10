import {LoggerLevel} from "./Logger";

export default {
  // "开发环境": null,
  "development": {
    "ROOT": "DEBUG",
  },
  // "测试环境": null,
  "test": {
    "ROOT": "INFO",
  },
  // "生产环境": null,
  "production": {
    "ROOT": "WARN",
  }
} as Record<string, Record<string, LoggerLevel>>;
