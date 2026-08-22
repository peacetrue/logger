---
name: logger-proxy-testing
description: Guidelines and patterns for testing Proxy behavior, logger factories, and category matching in peacetrue-logger.
---

# Testing in peacetrue-logger

This guide outlines best practices for writing unit tests for proxy behaviors, logger factories, and call-hierarchy tracing in `peacetrue-logger`.

## 1. Using MockLogger for Assertion
When testing that log messages and levels are correctly emitted without relying on console output, use [test/MockLogger.ts](file:///Users/xiayx/WebstormProjects/peacetrue-logger/test/MockLogger.ts):

```typescript
import {MockLogger, mockLoggerFactory, mockLoggerProxy} from "./MockLogger";

describe("MyProxyTest", () => {
  it("should log function invocation", () => {
    const fn = (x: number) => x * 2;
    const proxied = mockLoggerProxy.proxyFunction(fn, "TestFunc");
    proxied(5);
    
    // Assert on mockLoggerFactory or custom MockLogger records
  });
});
```

## 2. Testing Call Hierarchy & Spacing
When verifying nested calls and spacing indentation:
- `DefaultLoggerProxy` increments `functionHierarchy` at start and decrements in the `finally` block.
- Verify both `: start` and `: end` entries are produced even when an exception is thrown.
- Verify `arguments.length`, parameter names (parsed via `Function.toString()`), and `return:` / `error:` values.

## 3. Testing Class & Constructor Proxying
- Static methods on a class can be called directly or through the proxy reference.
- Constructor interception (`new ProxyUser(...)`) requires instantiating the proxied class returned from `proxyClass(User)`.
- For chained / recursive proxying (`Continuer`), test with `validContinuer` to ensure arguments/returns that are objects or functions get wrapped correctly.
