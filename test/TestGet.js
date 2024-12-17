Object.defineProperty(Object.prototype, 'variable', {
    value: "test",
    writable: true,
    configurable: true,
    enumerable: false,
  });

// Global handler for property access
const handler = {
  get(target, property, receiver) {
    console.log(`Property "${property}" was accessed`);
    return Reflect.get(...arguments);
  }
};

// const globalProxy = createGlobalProxy();
global = new Proxy(global, handler);

global.variable;//output: Property "variable" was accessed

// Proxy handler that will apply to every object
const globalProxy = new Proxy({}, handler);

// Wrap the entire global context with a Proxy
Object.setPrototypeOf(global, globalProxy);

func = function (){};
console.log(func.variable);//output: "test"
console.log(({}).variable);//output: "test"
console.log([].variable);//output: "test"
console.log(Symbol('asd').variable);//output: "test"
