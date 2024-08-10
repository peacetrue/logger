import {LoggerFactory} from "./LoggerFactory";
import {ContextLogger, LoggerProxy} from "./LoggerProxy";
import {buildProxySupportedInstanceOf} from "./proxy";
import {Logger} from "./Logger";


export type ClassCategory = (clazz: Function) => string;
export const defaultClassCategory: ClassCategory = (clazz: Function) => clazz.name;
export type ConstructorCategory = (clazz: Function, argArray: any[]) => string;
export const defaultConstructorCategory: ConstructorCategory = (clazz: Function, _argArray: any[]) => `${clazz.name}.constructor`;
export type InstanceCategory = (clazz: Function, instance: any) => string;
export const defaultInstanceCategory: InstanceCategory = (clazz: Function, _instance: any) => `<${clazz.name}>`;
export type FunctionCategory = (func: Function, clazzOrInstanceCategory?: string, clazzOrInstancePropName?: string) => string;
export const defaultFunctionCategory: FunctionCategory = (func: Function, clazzOrInstanceCategory?: string, clazzOrInstancePropName?: string) => `${clazzOrInstanceCategory ? clazzOrInstanceCategory + '.' : ''}${clazzOrInstancePropName || func.name || '<anonymous>'}`;
// 解析参数名：https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
export type FunctionArgumentNames = (func: Function) => string[];
export const defaultFunctionArgumentNames: FunctionArgumentNames = (func: Function) => {
  return Function.toString.call(func) // defend against the case when the function has a custom .toString() implementation
    .replace(/\/\/.*$/mg, '') // strip single-line comments
    .replace(/\s+/g, '') // strip white space
    .replace(/\/[*][^/*]*[*]\//g, '') // strip multi-line comments
    .split(/(\){)|(=>)/, 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
    .replace(/=[^,]+/g, '') // strip any ES6 defaults
    .split(',').filter(Boolean); // split & filter [""]
};

export type ArgumentCategory = (index: number, name?: string) => string;
export const defaultArgumentCategory: ArgumentCategory = (index: number, name?: string) => `[${name || index}]`;
export type Continuer = (category: string, object: any) => boolean;
export const defaultContinuer: Continuer = (_category: string, _object: any) => false;
export const validContinuer: Continuer = (_category: string, object: any) => Boolean(object);

const Proxy = buildProxySupportedInstanceOf();

// 静态和动态、当前和父级
export class DefaultLoggerProxy implements LoggerProxy {
  private readonly logger: Logger;
  private functionHierarchy: number = -1;
  loggerFactory: LoggerFactory;
  spacing: string = ' ';
  startMark: string = ': start';
  endMark: string = ': end';
  verbose: boolean = false;
  classCategory: ClassCategory = defaultClassCategory;
  constructorCategory: ConstructorCategory = defaultConstructorCategory;
  instanceCategory: InstanceCategory = defaultInstanceCategory;
  functionCategory: FunctionCategory = defaultFunctionCategory;
  functionArgumentNames: FunctionArgumentNames = defaultFunctionArgumentNames;
  argumentCategory: ArgumentCategory = defaultArgumentCategory;
  argumentContinuer: Continuer = defaultContinuer;
  returnContinuer: Continuer = defaultContinuer;

  constructor(loggerFactory: LoggerFactory) {
    this.loggerFactory = loggerFactory;
    this.logger = loggerFactory.getLogger(DefaultLoggerProxy.name);
  }

  private static _logger?: Logger;

  static getLogger(defaultLogger?: Logger) {
    return this._logger || defaultLogger;
  }

  proxyClass<T extends Function>(clazz: T) {
    // 代理静态函数
    this.doProxyInstance(clazz, this.classCategory(clazz));
    // 代理实例函数。clazz.prototype maybe null？
    clazz.prototype && this.doProxyInstance(clazz.prototype, this.instanceCategory);
    return this.doProxyConstruct(clazz);
  }

  private _continuer = true;

  private doProxyConstruct<T extends Function>(clazz: T): T {
    const that = this;
    return new Proxy(clazz, {
      construct(target: T, argArray: any[], newTarget: Function): object {
        const category = that.constructorCategory(target, argArray);
        // 重复代理时，因为缓存，导致后面的无法覆盖前面的，所以需要 that._continuer
        that._continuer = false;
        const instance = that.doProxy(category, target, argArray, () => Reflect.construct(target, argArray, newTarget));
        that._continuer = true;
        return that.doProxyInstance(instance, that.instanceCategory);
      }
    });
  }

  proxyInstance<T extends object>(instance: T, category?: string) {
    if (!category) category = this.instanceCategory(instance.constructor, instance);
    return this.doProxyInstance(instance, category);
  }

  bridgeUnproxifiableProperty = false;

  private doProxyInstance<T extends object>(instance: T, category: string | InstanceCategory): T {
    let descriptors = Object.getOwnPropertyDescriptors(instance);
    for (let descriptorsKey in descriptors) {
      let descriptor = descriptors[descriptorsKey];
      let value = descriptor.value;
      if (!this.filterFunction(value, descriptorsKey)) continue;
      if (descriptor.writable) {
        // @ts-ignore
        instance[descriptorsKey] = this.doProxyFunctionCachely(value, category, descriptorsKey);
      } else if (descriptor.configurable) {
        descriptor.value = this.doProxyFunctionCachely(value, category, descriptorsKey);
        Object.defineProperty(instance, descriptorsKey, descriptor);
      } else {
        if (this.bridgeUnproxifiableProperty) {
          return this.doProxyInstance({...instance}, category);
        } else {
          this.logger.warn(`the property '${descriptorsKey}' is not writable or configurable`, instance);
        }
      }
    }
    return instance;
  }

  /**
   * @see <a href="https://stackoverflow.com/questions/36372611/how-to-test-if-an-instance-is-a-proxy">如何判断对象是否 Proxy</a>
   */
  private filterFunction(value: any, p?: PropertyKey) {
    // 排除继承的方法，例如：Object 上的，!(p in Object.prototype)
    return value
      && typeof value === "function"
      && !(value instanceof Proxy)
      && (!p || !(p in Object.prototype))
      ;
  }

/*
  doProxyInstanceDynamically<T extends object>(instance: T, category: string | InstanceCategory) {
    const that = this;
    return new Proxy(instance, {
      get(target: T, p: string | symbol, receiver: any) {
        let value = Reflect.get(target, p, receiver);
        if (that.filterFunction(value, p)) {
          // ClanDiagram.error:  TypeError: 'get' on proxy: property 'setModel' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected 'function () { [native code] }' but got 'function () { [native code] }')
          return that.doProxyFunctionCachely(value as Function, category, p.toString());
        }
        return value;
      },
    });
  }
*/

  proxyFunction<T extends Function>(func: T, category?: string): T {
    let proxy = this.doProxyFunctionCachely(func, undefined, undefined, category);
    this.proxyInstance(func, category || this.functionCategory(func));
    return proxy;
  }

  // Function + category，不同的函数在不同分类下使用的代理不同
  private static _funcsCache = new WeakMap<Function, any>();

  private doProxyFunctionCachely<T extends Function>(func: T, clazzOrInstanceCategory?: string | InstanceCategory, clazzOrInstancePropName?: string, category?: string): T {
    if (DefaultLoggerProxy._funcsCache.has(func)) return DefaultLoggerProxy._funcsCache.get(func);
    let proxy = this.doProxyFunction(func, clazzOrInstanceCategory, clazzOrInstancePropName, category);
    DefaultLoggerProxy._funcsCache.set(func, proxy);
    return proxy;
  }

  private doProxyFunction<T extends Function>(func: T, clazzOrInstanceCategory?: string | InstanceCategory, clazzOrInstancePropName?: string, category?: string): T {
    const that = this;
    return new Proxy(func, {
      apply(target, thisArg: any, argArray: any[]) {
        if (!category) {
          (typeof clazzOrInstanceCategory === 'function') && (clazzOrInstanceCategory = clazzOrInstanceCategory(thisArg.constructor, thisArg));
          category = that.functionCategory(target, clazzOrInstanceCategory, clazzOrInstancePropName);
        }
        return that.doProxy(category, target, argArray, () => Reflect.apply(target, thisArg, argArray));
      }
    });
  }

  protected doProxy<T extends Function>(category: string, target: T, argArray: any[], invoker: () => any) {
    const logger = this.loggerFactory.getLogger(category);
    this.functionHierarchy++;
    const spacing = this.spacing.repeat(this.functionHierarchy);
    logger.info(spacing + category + this.startMark);
    const verbose = this.verbose ? `${category}.` : '';
    logger.debug(spacing + this.spacing + verbose + `arguments.length: ${argArray.length}`);
    const argumentNames = this.functionArgumentNames(target);
    argArray.forEach((argument: any, index: number) => {
      const argumentCategory = this.argumentCategory(index, argumentNames[index]);
      logger.debug(spacing + this.spacing + verbose + 'arguments' + argumentCategory + ":", argument);
      if (this._continuer && this.argumentContinuer(category, argument)) {
        argument = this.doProxyContinuer(argument, category + argumentCategory);
        argArray[index] = argument;
      }
    });

    try {
      DefaultLoggerProxy._logger = new SpacingLogger(logger, spacing + verbose);
      let result = invoker();
      logger.debug(spacing + this.spacing + verbose + 'return: ', result);
      if (this._continuer && this.returnContinuer(category, result)) {
        return this.doProxyContinuer(result, category + '.return');
      }
      return result;
    } catch (e) {
      logger.error(spacing + this.spacing + verbose + 'error: ', e);
      throw e;
    } finally {
      logger.info(spacing + category + this.endMark);
      this.functionHierarchy--;
      DefaultLoggerProxy._logger = undefined;
    }
  }

  // Conditionality
  protected doProxyContinuer(object: any, category: string) {
    if (this.filterFunction(object)) {
      object = this.doProxyFunctionCachely(object, undefined, undefined, category);
    } else if (DefaultLoggerProxy.isPlainObject(object)) {
      // https://stackoverflow.com/questions/65787971/ways-to-determine-if-something-is-a-plain-object-in-javascript
      object = this.doProxyInstance(object, category);
    }
    return object;
  }

  static isPlainObject(value: any) {
    return value && [undefined, Object].includes(value.constructor);
  }
}

export const contextLogger: ContextLogger = (defaultLogger?: Logger) => DefaultLoggerProxy.getLogger(defaultLogger);

class SpacingLogger implements Logger {
  private logger: Logger;
  private readonly spacing: string;

  get level() {
    return this.logger.level;
  }

  set level(level) {
    this.logger.level = level;
  }

  constructor(logger: Logger, spacing: string = "") {
    this.logger = logger;
    this.spacing = spacing;
  }

  debug(message: any, ...args: any[]): void {
    this.logger.debug(this.spacing, message, ...args);
  }

  error(message: any, ...args: any[]): void {
    this.logger.error(this.spacing, message, ...args);
  }

  info(message: any, ...args: any[]): void {
    this.logger.info(this.spacing, message, ...args);
  }

  trace(message: any, ...args: any[]): void {
    this.logger.trace(this.spacing, message, ...args);
  }

  warn(message: any, ...args: any[]): void {
    this.logger.warn(this.spacing, message, ...args);
  }

  isDebugEnabled(): boolean {
    return this.logger.isDebugEnabled();
  }

  isErrorEnabled(): boolean {
    return this.logger.isErrorEnabled();
  }

  isInfoEnabled(): boolean {
    return this.logger.isInfoEnabled();
  }

  isTraceEnabled(): boolean {
    return this.logger.isTraceEnabled();
  }

  isWarnEnabled(): boolean {
    return this.logger.isWarnEnabled();
  }

}
