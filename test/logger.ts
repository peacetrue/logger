import {consoleLoggerFactory, consoleLoggerProxy, noopLoggerFactory, noopLoggerProxy} from "../src";
/*
//tag::import[]
import {consoleLoggerFactory, consoleLoggerProxy, DefaultLoggerProxy, Logger, noopLoggerFactory, noopLoggerProxy} from "peacetrue-logger";

//end::import[]
*/
// 当实例的属性不可写也不可配置时，无法执行代理。
// 如果此时仍要代理，需要拷贝一份该实例，此操作会导致引用变更，引发未预期的重大影响，慎用！！
consoleLoggerProxy.bridgeUnproxifiableProperty = true;
// 是否代理方法的参数
consoleLoggerProxy.argumentContinuer = (_cat: string, obj: any): boolean => Boolean(obj);
// 是否代理方法的返回值，排除 React 元素
consoleLoggerProxy.returnContinuer = (_cat: string, obj: any) => {
  return obj?.$$typeof !== Symbol.for('react.element');
}

//tag::basic[]
// 是否生产环境
let prod = process.env.NODE_ENV === "production";
if (!prod) {
  let VConsole = require("vconsole"); // 手机端控制台
  // @ts-ignore
  localStorage.setItem('vConsole_switch_x', "100"); // 预设位置
  // @ts-ignore
  (window as any).vConsole = new VConsole({theme: 'dark',});
}
// 生产环境使用无操作代理
export const loggerFactory = prod ? noopLoggerFactory : consoleLoggerFactory;
export const loggerProxy = prod ? noopLoggerProxy : consoleLoggerProxy;
// 配置整体项目日志级别
loggerFactory.configure(require('./logger.json')[process.env.NODE_ENV || 'development']);
//end::basic[]


export type InstanceId = (instance: any) => string | number;
export type InstanceName = (clazz: Function, instance: any) => string;


let counter = 0;
const weakMap = new WeakMap();
export const defaultInstanceId: InstanceId = (instance: any) => (weakMap.get(instance) ?? (weakMap.set(instance, ++counter) && counter));
export const defaultInstanceName: InstanceName = (clazz: Function, instance: object) => {
  return `<${clazz.name}: ${defaultInstanceId(instance)}>`;
}

/*
export interface CollectionBuilder {
  build<E = any>(source: any): Collection<E> | undefined;
}

export class DefaultCollectionBuilder implements CollectionBuilder {
  build<E = any>(source: any): Collection<E> | undefined {
    if (source instanceof Array) {
      return new ArrayCollection(source);
    } else if (source instanceof Set) {
      return {
        size(): number {
          return source.size;
        },
        limit(_length: number): Collection<E> {
          return this;
        },
        forEach(callback: ForEachCallback<E>) {
          source.forEach(callback)
        }
      }
    } else if (source instanceof Map) {
      return {
        size(): number {
          return source.size;
        },
        limit(_length: number): Collection<E> {
          return this;
        },
        forEach(callback: ForEachCallback<E>) {
          let index = 0;
          source.forEach((key, value, map) => {
            callback([key, value] as E, index++, map);
          });
        }
      }
    }
    return undefined;
  }
}

export interface Collection<T = any> {
  size(): number;

  limit(length: number): Collection<T>;

  forEach(callback: ForEachCallback<T>): void;
}

type ForEachCallback<T = any> = (value: T, index: number, collection: any) => void;

class ArrayCollection<T = any> implements Collection<T> {
  collection: T[];

  constructor(collection: T[]) {
    this.collection = collection;
  }

  size(): number {
    return this.collection.length;
  }

  limit(length: number): Collection<T> {
    return new ArrayCollection(this.collection.slice(0, length));
  }

  forEach(callback: ForEachCallback<T>): void {
    this.collection.forEach(callback)
  }

}

class FunctionKey extends Object {
  func: Function;
  category?: string;

  constructor(func: Function, category?: string) {
    super();
    this.func = func;
    this.category = category;
  }

}

*/

