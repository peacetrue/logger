/** @deprecated  */
import {consoleLoggerConstructor} from "./ConsoleLogger";
import {DefaultLoggerFactory} from "./DefaultLoggerFactory";

export const consoleLoggerFactory = new DefaultLoggerFactory(consoleLoggerConstructor);
