import {DefaultLoggerProxy} from "./DefaultLoggerProxy";
import {consoleLoggerFactory} from "./consoleLoggerFactory";

export const consoleLoggerProxy = new DefaultLoggerProxy(consoleLoggerFactory);
