const {configureLogger, loadLoggerConfig} = require("./dist");

if (process.env.NODE_ENV !== 'production') {
    configureLogger(loadLoggerConfig());
}
