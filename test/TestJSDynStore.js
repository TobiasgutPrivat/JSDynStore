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
const parent = Object._pds_wrapWithProxy(new ParentObject(10));
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