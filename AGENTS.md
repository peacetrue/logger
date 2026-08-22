# peacetrue-logger Agent Guidelines

## 1. Project Overview & Architecture
`peacetrue-logger` is a lightweight, non-intrusive TypeScript library for function, class, and object execution tracing using ES6 `Proxy`. It automatically captures method signatures, arguments (with dynamically extracted parameter names), return values, execution call hierarchy indentation, and errors.

### Three-Tier Architecture
1. **Interface Layer (`src/Logger.ts`, `src/LoggerFactory.ts`, `src/LoggerProxy.ts`)**:
   - `Logger`: defines logging levels (`OFF`, `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE`) and logging methods.
   - `LoggerFactory`: manages and provides `Logger` instances categorized by hierarchical keys.
   - `LoggerProxy`: defines class, instance, and function proxying interfaces.
   - *Design principle*: Always design features against these core interfaces.
2. **Implementation Layer (`src/ConsoleLogger.ts`, `src/DefaultLoggerFactory.ts`, `src/DefaultLoggerProxy.ts`)**:
   - `ConsoleLogger`: formats and outputs messages to the console with fixed-width level tags (e.g. `[INFO ]`, `[DEBUG]`).
   - `DefaultLoggerFactory`: resolves loggers and log levels using longest-prefix category matching (e.g., `App.render` matches `App.render` over `App` or `ROOT`).
   - `DefaultLoggerProxy`: proxies methods in-place or via constructor intercepts, handles call-hierarchy spacing (`SpacingLogger`), and supports argument/return continual proxying (`Continuer`).
3. **Instance & Configuration Layer (`src/instances.ts`, `src/config.ts`, `src/consoleLoggerFactory.ts`, `src/consoleLoggerProxy.ts`)**:
   - Provides global singletons and easy toggling between development console logging and zero-cost production no-op implementations (`switchToConsole()`, `switchToNoop()`).

---

## 2. Key Architectural Invariants & Gotchas
- **Proxy In-place vs Construct Interception**:
  - `proxyInstance` and static/prototype method proxying modify property descriptors in-place on existing objects/prototypes.
  - Class constructor proxying requires creating a new `Proxy` around the constructor function (`proxyClass(Clazz)`).
  - Inherited properties directly on `Object.prototype` must **never** be proxied.
  - `_funcsCache` (WeakMap) prevents redundant proxying of the same function under the same context.
- **Production Performance**:
  - `NoopLogger`, `NoopLoggerFactory`, and `NoopLoggerProxy` must remain strictly zero-overhead and side-effect free.
- **Module Exports**:
  - Ensure all public types, classes, functions, and singleton instances are cleanly re-exported in [src/index.ts](file:///Users/xiayx/WebstormProjects/peacetrue-logger/src/index.ts).

---

## 3. Development Workflow & Commands
- **Test**: `pnpm test` (Runs Jest with `ts-jest`).
- **Build**: `pnpm run build` (Runs Rollup to compile dual ESM (`dist/index.mjs`) and CJS (`dist/index.cjs`) formats with declaration files (`dist/index.d.ts`)).
- **Lint/Typecheck Verification**: Run `pnpm run build && pnpm test` to ensure both compilation and tests pass before committing code.

---

## 4. Code & Testing Conventions
- **TypeScript**: Use strict types; prefer generics with constraints (e.g., `<T extends Function>`) over `any` where possible.
- **Testing**:
  - Use `test/MockLogger.ts` to inspect emitted log levels and payloads without polluting stdout.
  - Use `_setLocalConsole` when testing `ConsoleLogger` custom console routing.
