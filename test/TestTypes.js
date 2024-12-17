Object.defineProperties(Object.prototype, {
    isObject: {
      value: function () {
          console.log(typeof this, this instanceof Object);
      },
      writable: true,
      configurable: true,
      enumerable: false,
    },
});

"test".isObject();//output: true
console.log("test" instanceof Object);//output: false
(1).isObject();//output: true
console.log(1 instanceof Object);//output: false
// -> primitives are not instances of Object per default (including null, undefined)

func = function (){}
func.isObject();
({}).isObject();
[].isObject();
Symbol('asd').isObject();
1234567890123456789012345678901234567890n.isObject();
