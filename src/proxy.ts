const instances = new WeakSet();

export function buildProxySupportedInstanceOf(Constructor: ProxyConstructor = Proxy) {
  return new Constructor(Constructor, {
    construct(TargetConstructor, argArray, _newTarget) {
      let instance = new TargetConstructor(argArray[0], argArray[1]);
      instances.add(instance);
      return instance;
    },
    get(target, prop: string | symbol, receiver: any) {
      if (prop === Symbol.hasInstance) {
        return (instance: any) => instances.has(instance)
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}
