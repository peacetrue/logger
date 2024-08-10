import {consoleLogger} from "../src";

class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  setName(name: string) {
    this.name = name;
  }

}

describe('ProxyHandler', () => {
  const ProxyUser = new Proxy(User, {
    // @ts-ignore
    apply(target: User, thisArg: any, argArray: any[]): any {
      consoleLogger.info("apply:", arguments);
      // @ts-ignore
      return Reflect.apply(target, thisArg, argArray);
    },
    // @ts-ignore
    construct(target: User, argArray: any[], newTarget: Function): Object {
      consoleLogger.info("construct:", arguments);
      // @ts-ignore
      return Reflect.construct(target, argArray, newTarget);
    },
    // @ts-ignore
    defineProperty(target: User, property: string | symbol, attributes: PropertyDescriptor): boolean {
      consoleLogger.info("defineProperty:", arguments);
      // @ts-ignore
      return Reflect.defineProperty(target, property, attributes);
    },
    // @ts-ignore
    deleteProperty(target: User, p: string | symbol): boolean {
      consoleLogger.info("deleteProperty:", arguments);
      // @ts-ignore
      return Reflect.deleteProperty(target, p);
    },
    // @ts-ignore
    get(target: User, p: string | symbol, receiver: any): any {
      consoleLogger.info("get:", arguments);
      // @ts-ignore
      return Reflect.get(target, p, receiver);
    },
    // @ts-ignore
    getOwnPropertyDescriptor(target: User, p: string | symbol): PropertyDescriptor | undefined {
      consoleLogger.info("getOwnPropertyDescriptor:", arguments);
      // @ts-ignore
      return Reflect.getOwnPropertyDescriptor(target, p);
    },
    // @ts-ignore
    getPrototypeOf(target: User): Object | null {
      consoleLogger.info("getPrototypeOf:", arguments);
      // @ts-ignore
      return Reflect.getPrototypeOf(target);
    },
    // @ts-ignore
    has(target: User, p: string | symbol): boolean {
      consoleLogger.info("has:", arguments);
      // @ts-ignore
      return Reflect.has(target, p);
    },
    // @ts-ignore
    isExtensible(target: User): boolean {
      consoleLogger.info("isExtensible:", arguments);
      // @ts-ignore
      return Reflect.isExtensible(target);
    },
    // @ts-ignore
    ownKeys(target: User): ArrayLike<string | symbol> {
      consoleLogger.info("ownKeys:", arguments);
      // @ts-ignore
      return Reflect.ownKeys(target);
    },
    // @ts-ignore
    preventExtensions(target: User): boolean {
      consoleLogger.info("preventExtensions:", arguments);
      // @ts-ignore
      return Reflect.preventExtensions(target);
    },
    // @ts-ignore
    set(target: User, p: string | symbol, newValue: any, receiver: any): boolean {
      consoleLogger.info("set:", arguments);
      // @ts-ignore
      return Reflect.set(target, p, newValue, receiver);
    },
    // @ts-ignore
    setPrototypeOf(target: User, v: Object | null): boolean {
      consoleLogger.info("setPrototypeOf:", arguments);
      // @ts-ignore
      return Reflect.setPrototypeOf(target, v);
    }
  });
  // const a: User = new ProxyUser("");
  it('instanceof', () => {
    expect(ProxyUser).toBeTruthy();
  });
  it('apply', () => {
    // @ts-ignore
    expect(() => ProxyUser()).toThrow();
  });
  it('construct', () => {
    let user = new ProxyUser("admin");

    expect(user.toString().startsWith("function"));
  });
  it('get', () => {
    expect(ProxyUser.toString().startsWith("function"));

  });
});
