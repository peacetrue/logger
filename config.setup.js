import {configureLogger, loadLoggerConfig} from "peacetrue-logger";

if (process.env.NODE_ENV !== 'production') {
    configureLogger(loadLoggerConfig());
}
