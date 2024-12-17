import { createObject, updateObject, getObject, deleteObject } from './database.js';

function extendGlobalObjectJDS() {
  // Guard against extending prototype multiple times
  if (Object.prototype._jds_save) return;

  Object.defineProperties(Object.prototype, {
    _jds_id: {
      value: null,
      writable: true,
      configurable: true,
      enumerable: false,
    },
    _jds_loaded: {
      value: true,
      writable: true,
      configurable: true,
      enumerable: false,
    },
    _jds_load: {
      value: function () {
        if (!this._jds_id) return;

        if (this._jds_loaded) return;
        
        const data = getObject(this._jds_id);
        Object.assign(this, data.dict); // Load dict data
        Object.keys(data.items).forEach(key => {
          this[key] = data.items[key];
        });
        this._jds_loaded = true;
      },
      writable: true,
      configurable: true,
      enumerable: false,
    },
    _jds_unload: {
      value: function () {
        if (this._jds_loaded) {
          for (const key in this) {
            if (key !== "_jds_id") delete this[key];
          }
          this._jds_loaded = false;
        }
      },
      writable: true,
      configurable: true,
      enumerable: false,
    },
    _jds_save: {
      value: function (customId = null) {
        if (!this._jds_loaded) return;

        // primitives do not inherit from Object
        // TODO test how functions/Symbols store data

        const dict = { ...this };
        ["_jds_id", "_jds_loaded"].forEach(key => delete dict[key]);

        this = new Proxy(this, handler);

        this._jds_unload(); // unload before saving sub-objects to not save on recursion

        if (!this._jds_id) {
          this._jds_id = customId || createObject({ temp: true }); // create placeholder object to get id for sub-objects to have id on recursion
        }

        dict.values().forEach(value => { // save sub-objects first to not save values in parent as well
          if (typeof value === "object" && value !== null) {
            value._jds_save();
          }
        });

        updateObject(this._jds_id, dict); //save self to DB
      },
      writable: true,
      configurable: true,
      enumerable: false,
    },
    _jds_untrack: { //probably not really needed
      value: function () {
        if (this._jds_id) {
          this._jds_load(); // return object with loaded data but untracked
          deleteObject(this._jds_id); //remove on database
          //TODO make sure that prototype properties are not deleted (only on objects)
          delete this._jds_id; // remove tracking data
          delete this._jds_loaded;
        }
      },
      writable: true,
      configurable: true,
      enumerable: false,
    },
    // get: {
    //   value: function (key) {
    //     if (key === "_jds_id") return this._jds_id;
    //     if (key === "_jds_loaded") return this._jds_loaded;
    //     this._jds_load();
    //     return this[key];
    //   },
    //   writable: true,
    //   configurable: true,
    //   enumerable: false,
    // },
    _jds_wrapWithProxy:{ //TODO maybe integrate into save, by returning it as proxy -> must be replaced by returned proxy for loading (previous won't load data automaticly)
      value: function () {
        if (this._jds_proxied) return this; //check if already proxied (TODO test)
        return new Proxy(this, {
            get(target, prop, receiver) {
              if (prop === "_jds_id") return target._jds_id;
              if (prop === "_jds_loaded") return target._jds_loaded;
              target._jds_load();
              return target[prop];
            },
            _jds_proxied: true
        });
      }
    },
  });
};

// Helper function to load a tracked object
function loadObjectJDS(id, type) {
  const obj = new type();
  obj._jds_id = id;
  obj._jds_loaded = false;
  this = new Proxy(this, handler);
  return obj;
}

MediaSourceHandle.exports = extendGlobalObjectJDS, loadObjectJDS;

extendGlobalObjectJDS();

class SubObject {
  constructor(value) {
      this.value = value;
  }
}

class ParentObject {
  constructor(value) {
      this.value = value;
      this.sub_obj = new SubObject(value * 2);
  }
}

// Test Code
const parent = Object._jds_wrapWithProxy(new ParentObject(10));
console.log("Before Save:", parent);

parent._pds_save("parent_1");

console.log("After Save:", parent);

// Accessing a missing property to trigger lazy load
console.log("Accessing missing property:");
console.log(parent.someMissingProperty);

parent._pds_untrack();
console.log("After Untrack:", parent);

// Reload object
const loadedParent = loadObjectPDS("parent_1", ParentObject);
console.log("After Reload (before access):", loadedParent);
console.log("Accessing property after reload:", loadedParent.value);