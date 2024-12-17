data = {}

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

function createObject(obj) {
    const id = generateId();
    data[id] = obj;
    return id;
}

function updateObject(id, obj) {
    data[id] = obj;
}

function getObject(id) {
    return data[id];
}

function deleteObject(id) {
    delete data[id];
}

module.exports = {
    createObject,
    updateObject,
    getObject,
    deleteObject,
}