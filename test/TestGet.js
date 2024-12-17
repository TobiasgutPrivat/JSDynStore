Object.defineProperty(Object.prototype, 'variable', {
    value: "test",
    writable: true,
    configurable: true,
    enumerable: false,
  });

// Global handler for property access
const handler = {
  get(target, prop, receiver) {
    console.log(`Accessing property: ${prop}`);
    return prop in target ? target[prop] : undefined;
  }
};

// const globalProxy = createGlobalProxy();
global = new Proxy(global, handler);

global.variable;//output: Property "variable" was accessed

Object.prototype = new Proxy(Object.prototype, handler);

func = function (){};
console.log(func.variable);//output: "test"
console.log({}.toString);//output: "test"
console.log([].variable);//output: "test"
console.log(Symbol('asd').variable);//output: "test"
