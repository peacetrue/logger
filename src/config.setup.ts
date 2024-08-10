import {configureLogger, loadLoggerConfig} from "./config";
if (process.env.NODE_ENV !== 'production') {
  configureLogger(loadLoggerConfig());
}
export {};
