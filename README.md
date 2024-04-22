日志代理
----

`peacetrue-logger` 用于代理函数，打印其执行信息，包括：方法签名、参数和返回值。

快速上手
----

安装类库：

    npm install peacetrue-logger

配置项目日志：

    import {consoleLoggerFactory, consoleLoggerProxy, DefaultLoggerProxy, Logger, noopLoggerFactory, noopLoggerProxy} from "peacetrue-logger";

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

logger.json

    {
      "//开发环境": null,
      "development": {
        "ROOT": "DEBUG",
        "other category": "INFO"
      },
      "//测试环境": null,
      "test": {
        "ROOT": "INFO"
      },
      "//生产环境": null,
      "production": {
        "ROOT": "OFF"
      }
    }

代理类：

    import {consoleLoggerProxy} from "peacetrue-logger";

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

    //代理测试类
    const ProxyUser: typeof User = consoleLoggerProxy.proxyClass(User);

调用静态函数：

        User.staticFunction(1) // 等效于 ProxyUser.staticFunction(1)

静态函数日志：

    [INFO ] User.staticFunction: start
    [DEBUG]  arguments.length: 1
    [DEBUG]  arguments[args]: 1
    [DEBUG]  return:  1
    [INFO ] User.staticFunction: end

调用类函数：

        const user = new User();
        user.classFunction(1)

类函数日志：

    [INFO ] <User>.classFunction: start
    [DEBUG]  arguments.length: 1
    [DEBUG]  arguments[args]: 1
    [DEBUG]  return:  1
    [INFO ] <User>.classFunction: end

调用构造函数：

        // 此处必须使用 ProxyUser 而非 User，无法在不变更 User 的情况下代理构造器
        let user = new ProxyUser((arg) => arg,);

构造函数日志：

    [INFO ] User.constructor: start
    [DEBUG]  arguments.length: 1
    [DEBUG]  arguments[instanceFunction]: function (arg) { return arg; }
    [DEBUG]  return:  [object Object]
    [INFO ] User.constructor: end

调用实例函数：

        user.instanceFunction?.(1)

实例函数日志：

    [INFO ] <User>.instanceFunction: start
    [DEBUG]  arguments.length: 1
    [DEBUG]  arguments[arg]: 1
    [DEBUG]  return:  1
    [INFO ] <User>.instanceFunction: end

一个 React 项目中的日志：

    [INFO ] App: start
    [DEBUG]  arguments.length: 2
    [DEBUG]  arguments[0]: Object
    [DEBUG]  arguments[1]: Object
    [INFO ]  React.useState: start
    [INFO ]  React.useState: end
    [DEBUG]  return:  Object
    [INFO ] App: end
    [INFO ] ClanDiagram: start
    [INFO ]  React.useMemo: start
    [INFO ]   React.useMemo[create]: start
    [INFO ]    DiagramFacade.constructor: start
    [INFO ]      ModelDiagramSettings.buildDiagramSettings: start
    [INFO ]       ModelDiagramSettings.defaultDiagramSettings: start
    [INFO ]       ModelDiagramSettings.defaultDiagramSettings: end
    [INFO ]      ModelDiagramSettings.buildDiagramSettings: end
    [INFO ]    DiagramFacade.constructor: end
    [INFO ]   React.useMemo[create]: end
    [INFO ]  React.useMemo: end
    [INFO ] ClanDiagram: end

进阶教程
----

### 类图

![类图](image?file=%2FUsers%2Fxiayx%2FDocuments%2FProjects%2Flogger%2F%E7%B1%BB%E5%9B%BE.png&mac=wuBDt6y97zH0P3neowON4xQ6ilOx/iQk2KEVBOnu8p8=&hash=bd5b24ff96ff2857b2e12f0e4ea4db3f)

*   接口层：提供接口，便于自定义扩展

*   默认实现层：提供接口的默认实现

*   实例层：提供开箱即用的实例


`Noop*` 无操作系列用于切换到生产环境时使用。 `MockLogger` 在测试目录中。

### Logger

使用控制台日志，默认日志级别为 `INFO`：

ConsoleLogger.test.ts

    import {consoleLogger, DEFAULT_LOGGER_LEVEL} from "peacetrue-logger";

        // 默认 INFO
        expect(consoleLogger.level).toEqual(DEFAULT_LOGGER_LEVEL);
        expect(consoleLogger.isErrorEnabled()).toEqual(true);
        expect(consoleLogger.isWarnEnabled()).toEqual(true);
        expect(consoleLogger.isInfoEnabled()).toEqual(true);
        expect(consoleLogger.isDebugEnabled()).toEqual(false);
        expect(consoleLogger.isTraceEnabled()).toEqual(false);

        function logs() {
          consoleLogger.error("error");
          consoleLogger.warn("warn");
          consoleLogger.info("info");
          consoleLogger.debug("debug");
          consoleLogger.trace("trace");
        }

        logs();

输出如下日志：

    [ERROR] error
    [WARN ] warn
    [INFO ] info

### LoggerFactory

使用控制台日志工厂：

DefaultLoggerFactory.test.ts

    import {CATEGORY_ROOT, consoleLoggerFactory, DEFAULT_LOGGER_LEVEL} from "peacetrue-logger";

        //获取根分类日志，根分类日志对所有日志生效，默认级别为 INFO
        expect(consoleLoggerFactory.getLogger()).toEqual(consoleLoggerFactory.getLogger(CATEGORY_ROOT));
        expect(consoleLoggerFactory.getLogger().level).toEqual(DEFAULT_LOGGER_LEVEL);
        // 未配置 App 分类，默认使用根分类
        expect(consoleLoggerFactory.getLogger("App").level).toEqual(DEFAULT_LOGGER_LEVEL);
        // 配置后使用指定的，此处按前缀匹配
        consoleLoggerFactory.configure("App", "DEBUG");
        expect(consoleLoggerFactory.getLogger("App").level).toEqual("DEBUG");
        expect(consoleLoggerFactory.getLogger("App.render").level).toEqual("DEBUG");
        // 使用匹配程度更高的
        consoleLoggerFactory.configure("App.render", "WARN");
        expect(consoleLoggerFactory.getLogger("App.render").level).toEqual("WARN");

### LoggerProxy

使用控制台日志代理：

DefaultLoggerProxy.test.ts

    import {consoleLoggerProxy} from "peacetrue-logger";

#### 代理函数

调用函数

        let arrowFunction = (args: any) => args;
        consoleLoggerProxy.proxyFunction(arrowFunction)(1);

函数日志

    [INFO ] arrowFunction: start
    [DEBUG]  arguments.length: 1
    [DEBUG]  arguments[args]: 1
    [DEBUG]  return:  1
    [INFO ] arrowFunction: end

#### 代理实例

调用函数

        let instance = {instanceFunction: (arg: any) => arg};
        // 设置分类为：Instance，默认为 <Object>
        consoleLoggerProxy.proxyInstance(instance, "Instance");
        instance.instanceFunction(1);

函数日志

    [INFO ] Instance.instanceFunction: start
    [DEBUG]  arguments.length: 1
    [DEBUG]  arguments[arg]: 1
    [DEBUG]  return:  1
    [INFO ] Instance.instanceFunction: end

#### 代理类

参考 快速上手。

注意事项
----

*   `DefaultLoggerProxy` 采用就地执行模式，无法代理后续新增的属性；如果属性值被更改则代理失效

*   异步执行可能会对方法层级产生不确定的负面影响

*   不代理继承的方法和 `Object` 上的方法


