import {contextLogger, defaultContinuer, defaultFunctionArgumentNames, DefaultLoggerFactory, DefaultLoggerProxy, validContinuer} from "../src";
import fs from "fs";
// @ts-ignore
import {mockLogger, mockLoggerConstructor} from "./MockLogger";
/*
//tag::import[]
import {consoleLoggerProxy} from "@peace/logger";
//end::import[]
*/

// 同步文档名称
let consoleLoggerProxy = new DefaultLoggerProxy(new DefaultLoggerFactory(mockLoggerConstructor));

afterEach(() => mockLogger.clear());

describe('LoggerProxy.proxyFunction', () => {
  it('adoc', () => {
    //tag::proxyFunction[]
    let arrowFunction = (args: any) => args;
    consoleLoggerProxy.proxyFunction(arrowFunction)(1);
    //end::proxyFunction[]
    fs.createWriteStream('test/log/proxyFunction.log').write(mockLogger.toString())
  });

  let arrowFunction = (args: any) => args;

  function basicTest(func: (args: any) => any, msgStart?: string, category?: string) {
    let proxyFunc = consoleLoggerProxy.proxyFunction(func, category);
    // 代理函数不同于原函数
    expect(proxyFunc).not.toEqual(func);
    // 代理函数与原函数执行结果相同
    expect(proxyFunc(1)).toEqual(func(1));
    // 起止 2 条，参数数目和返回值 2 条，再加参数个数
    expect(mockLogger.messages.length).toEqual((2 + 2 + 1));
    // 记录的日志信息需匹配：msgStart*
    expect((mockLogger.messages[0].msg as string).startsWith(msgStart || func.name)).toBeTruthy();
    mockLogger.clear();
    return proxyFunc;
  }

  it('arrowFunction', () => {
    basicTest(arrowFunction);
  });

  it('declareFunction', () => {
    //@formatter:off
    function declareFunction(args: any) {return args;}
    declareFunction.staticFunction = function(args:any){return args;}
    //@formatter:on
    let staticFunction = declareFunction.staticFunction;
    basicTest(declareFunction);
    expect(declareFunction.staticFunction).not.toEqual(staticFunction);
  });
  it('varFunction', () => {
    //@formatter:off
    let varFunction = function (args: any) {return args;}
    //@formatter:on
    basicTest(varFunction);
  });
  it('anonymousFunction', () => {
    //@formatter:off
    const varFunction = (() => (function (args: any) {return args;}))();
    //@formatter:on
    expect(varFunction.name).toEqual("");
    basicTest(varFunction, "<anonymous>");
  });
  it('nest', () => {
    let proxyArrowFunction = consoleLoggerProxy.proxyFunction(arrowFunction);
    let arrowFunction2 = (args: any) => proxyArrowFunction(args);
    let proxyArrowFunction2 = consoleLoggerProxy.proxyFunction(arrowFunction2);
    expect(arrowFunction2(1)).toEqual(proxyArrowFunction2(1));
    expect(mockLogger.messages.length).toEqual((2 + 2 + 1) * 3);
  });
  it('cache', () => {
    expect(consoleLoggerProxy.proxyFunction(arrowFunction)).toStrictEqual(consoleLoggerProxy.proxyFunction(arrowFunction));
  });
  it('customCategory', () => {
    let arrowFunction = (args: any) => args;
    let category = "customCategory";
    basicTest(arrowFunction, category, category);
  });
});

describe('LoggerProxy.proxyInstance', () => {
  it('adoc', () => {
    //tag::proxyInstance[]
    let instance = {instanceFunction: (arg: any) => arg};
    // 设置分类为：Instance，默认为 <Object>
    consoleLoggerProxy.proxyInstance(instance, "Instance");
    instance.instanceFunction(1);
    //end::proxyInstance[]
    fs.createWriteStream('test/log/proxyInstance.log').write(mockLogger.toString())
  });


  it('object', () => {
    // 不代理对象默认的方法
    let instance = consoleLoggerProxy.proxyInstance(new Object(1));
    expect(instance.valueOf()).toEqual(1);
    expect(mockLogger.messages.length).toEqual(0);
  });
  it('plainObject', () => {
    let instance = {instanceFunction: (args: any) => args};
    consoleLoggerProxy.proxyInstance(instance, "instance");
    expect(instance.instanceFunction(1)).toEqual(1);
    expect(mockLogger.messages.length).toEqual(2 + 2 + 1);
    expect((mockLogger.messages[0].msg as string).startsWith("instance.instanceFunction")).toBeTruthy();
  });

  it('new', () => {
    let instance = consoleLoggerProxy.proxyInstance(new User());
    // 不影响类函数
    expect(instance.classFunction).toEqual(instance.classFunction);
  });

});

//tag::User[]

// 声明一个测试用户类
class User {
  instanceFunction?: <T = any>(arg: T) => T;

  constructor(instanceFunction?: <T>(arg: T) => T,) {
    this.instanceFunction = instanceFunction;
  }

  //@formatter:off
  classFunction<T>(args: T) {return args;}
  static staticFunction<T>(args: T) {return args;}
  //@formatter:on
}

//end::User[]

// _name?: <T>(arg: T) => T;
// get name() {return this._name;}
// set name(name: (<T>(arg: T) => T) | undefined) {this._name = name;}

// @ts-ignore
function _local() {
//tag::UserFunc[]

  // 此写法与上述类写法等效
  function User(this: any, instanceFunction?: <T>(arg: T) => T) {
    this.instanceFunction = instanceFunction;
  }

//@formatter:off
  User.prototype = { classFunction<T>(args: T) { return args;} }
  User.staticFunction = function <T>(args: T) { return args;}
//@formatter:on

//end::UserFunc[]
}

//tag::proxyClass[]
//代理测试类
const ProxyUser: typeof User = consoleLoggerProxy.proxyClass(User);
//end::proxyClass[]
describe('LoggerProxy.proxyClass', () => {
  consoleLoggerProxy.argumentContinuer = defaultContinuer;
  consoleLoggerProxy.returnContinuer = defaultContinuer;
  it('staticFunction', () => {
    expect(ProxyUser.staticFunction).toEqual(User.staticFunction);
    expect(
      //@formatter:off
    //tag::staticFunction[]
    User.staticFunction(1) // 等效于 ProxyUser.staticFunction(1)
    //end::staticFunction[]
    //@formatter:on
    ).toEqual(1);
    expect(mockLogger.messages.length).toEqual(2 + 2 + 1);
    fs.createWriteStream('test/log/User.staticFunction.log').write(mockLogger.toString())
    expect(mockLogger.messages[0].msg.startsWith(`${User.name}.staticFunction`)).toBeTruthy();
  });
  it('classFunction', () => {
    //tag::classFunction[]
    const user = new User();
    //end::classFunction[]
    expect(
      //@formatter:off
    //tag::classFunction[]
    user.classFunction(1)
    //end::classFunction[]
    //@formatter:on
    ).toEqual(1);
    fs.createWriteStream('test/log/User.classFunction.log').write(mockLogger.toString())
    expect(mockLogger.messages.length).toEqual(2 + 2 + 1);
  });
  it('instanceFunction', () => {
    expect(ProxyUser).not.toEqual(User);
    expect(ProxyUser.constructor).toEqual(User.constructor);
    //tag::constructor[]
    // 此处必须使用 ProxyUser 而非 User，无法在不变更 User 的情况下代理构造器
    let user = new ProxyUser((arg) => arg,);
    //end::constructor[]
    expect(mockLogger.messages.length).toEqual(2 + 2 + 1);
    fs.createWriteStream('test/log/User.constructor.log').write(mockLogger.toString())
    expect(mockLogger.messages[0].msg.startsWith(`${User.name}.constructor`)).toBeTruthy();
    mockLogger.clear();

    expect(
      //@formatter:off
    //tag::instanceFunction[]
    user.instanceFunction?.(1)
    //end::instanceFunction[]
    //@formatter:on
    ).toEqual(1);
    expect(mockLogger.messages.length).toEqual(2 + 2 + 1);
    fs.createWriteStream('test/log/User.instanceFunction.log').write(mockLogger.toString())
    expect(mockLogger.messages[0].msg.startsWith(`<${User.name}>.instanceFunction`)).toBeTruthy();
  });


});
describe('LoggerProxy.argumentReturn', () => {
  consoleLoggerProxy.argumentContinuer = validContinuer;
  consoleLoggerProxy.returnContinuer = validContinuer;
  it('classFunction', () => {
    const user = new User();
    expect(user.classFunction((arg: any) => arg)(1)).toEqual(1);
    expect(mockLogger.messages.length).toEqual((2 + 2 + 1) * 2);
    fs.createWriteStream('test/log/User.classFunction.argument.log').write(mockLogger.toString())
    expect(mockLogger.messages[0].msg.startsWith(`<${User.name}>.classFunction`)).toBeTruthy();
  });
  it('instanceFunction', () => {
    let user = new ProxyUser((arg) => arg);
    expect(user.instanceFunction?.((arg: any) => arg)(1)).toEqual(1);
    expect(mockLogger.messages.length).toEqual((2 + 2 + 1) * 3);
    fs.createWriteStream('test/log/User.instanceFunction.argument.log').write(mockLogger.toString())
  });
});


describe('LoggerProxy.contextLogger', () => {
  it('classFunction', () => {
    let func = (arg: any) => {
      contextLogger()?.info("func");
      return arg;
    };
    func = consoleLoggerProxy.proxyFunction(func);
    const func2 = (arg: any) => {
      contextLogger()?.info("func2 other start");
      let ret = func(arg);
      contextLogger()?.info("func2 other end");
      return ret;
    }
    expect(consoleLoggerProxy.proxyFunction(func2)(1)).toEqual(1);

    // expect(mockLogger.messages.length).toEqual((2 + 2 + 1) * 2 + 1);
    fs.createWriteStream('test/log/LoggerProxy.contextLogger.log').write(mockLogger.toString())
    // expect(mockLogger.messages[0].msg.startsWith(`<${User.name}>.classFunction`)).toBeTruthy();
  });
});

// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
describe('defaultFunctionArgumentNames', () => {
  it('arrowFunction', () => {
    let arrowFunction = (args: any) => args;
    expect(defaultFunctionArgumentNames(arrowFunction)).toEqual(["args"]);
  });
});

describe('type', () => {
  it('isPlainObject', () => {
    let object = {};
    expect(Object.getPrototypeOf(object)).toEqual(Object.prototype);
  });
});
