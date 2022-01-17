const axios = require("axios");

const version = 2;

let baseUrl;
let wdToken;
let data;

function setup(username, siteName, token) {
    data = {
        username, siteName
    };
    baseUrl = "https://" + username + ".wixsite.com/" + siteName + "/_functions/";
    wdToken = token;
    return {
        get,
        query,
        insert,
        bulkInsert,
        update,
        bulkUpdate,
        remove,
        bulkRemove
    };
}

function enableDevMode() {
    baseUrl = "https://" + data.username + ".wixsite.com/" + data.siteName + "/_functions-dev/";
}

function disableDevMode() {
    baseUrl = "https://" + data.username + ".wixsite.com/" + data.siteName + "/_functions/";
}

class WixDataQuery {
    #collectionId;
    #query;
    constructor(collectionId) {
        this.#collectionId = collectionId;
        this.#query = [];
    }
    eq(propertyName, value) {
        this.#query.push({ "type": "eq", "property": propertyName, "value": value });
        return this;
    }
    ne(propertyName, value) {
        this.#query.push({ "type": "ne", "property": propertyName, "value": value });
        return this;
    }
    gt(propertyName, value) {
        this.#query.push({ "type": "gt", "property": propertyName, "value": value });
        return this;
    }
    ge(propertyName, value) {
        this.#query.push({ "type": "ge", "property": propertyName, "value": value });
        return this;
    }
    lt(propertyName, value) {
        this.#query.push({ "type": "lt", "property": propertyName, "value": value });
        return this;
    }
    le(propertyName, value) {
        this.#query.push({ "type": "le", "property": propertyName, "value": value });
        return this;
    }
    between(propertyName, rangeStart, rangeEnd) {
        this.#query.push({ "type": "between", "property": propertyName, "start": rangeStart, "end": rangeEnd });
        return this;
    }
    contains(propertyName, string) {
        this.#query.push({ "type": "contains", "property": propertyName, "string": string });
        return this;
    }
    startsWith(propertyName, string) {
        this.#query.push({ "type": "startsWith", "property": propertyName, "string": string });
        return this;
    }
    endsWith(propertyName, string) {
        this.#query.push({ "type": "endsWith", "property": propertyName, "string": string });
        return this;
    }
    hasAll(propertyName, value) {
        this.#query.push({ "type": "hasAll", "property": propertyName, "value": value });
        return this;
    }
    hasSome(propertyName, value) {
        this.#query.push({ "type": "hasSome", "property": propertyName, "value": value });
        return this;
    }
    isEmpty(propertyName) {
        this.#query.push({ "type": "isEmpty", "property": propertyName });
        return this;
    }
    isNotEmpty(propertyName) {
        this.#query.push({ "type": "isNotEmpty", "property": propertyName });
        return this;
    }
    ascending(propertyName) {
        this.#query.push({ "type": "asc", "property": propertyName });
        return this;
    }
    descending(propertyName) {
        this.#query.push({ "type": "desc", "property": propertyName });
        return this;
    }
    limit(limit) {
        this.#query.push({ "type": "limit", "limit": limit });
        return this;
    }
    include(propertyName) {
        this.#query.push({ "type": "include", "property": propertyName });
        return this;
    }
    find() {
        return new Promise((resolve, reject) => {
            axios.post(baseUrl + "/wixData", {
                "token": wdToken,
                "version": version,
                "type": "query.find",
                "collectionId": this.#collectionId,
                "query": this.#query
            }).then(function (res) {
                resolve(res.data.result);
            }).catch(function (err) {
                reject(err.response.data);
            });
        });
    }
    count() {
        return new Promise((resolve, reject) => {
            axios.post(baseUrl + "/wixData", {
                "token": wdToken,
                "version": version,
                "type": "query.count",
                "collectionId": this.#collectionId,
                "query": this.#query
            }).then(function (res) {
                resolve(res.data.result);
            }).catch(function (err) {
                reject(err.response.data);
            });
        });
    }
}

function query(collectionId) {
    let query = new WixDataQuery(collectionId);
    return query;
}

function get(collectionId, itemId) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + "/wixData", {
            "token": wdToken,
            "version": version,
            "type": "get",
            "collectionId": collectionId,
            "itemId": itemId
        }).then(function (res) {
            resolve(res.data.result);
        }).catch(function (err) {
            reject(err.response.data);
        });
    });
}

function insert(collectionId, item) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + "/wixData", {
            "token": wdToken,
            "version": version,
            "type": "insert",
            "collectionId": collectionId,
            "item": item
        }).then(function (res) {
            resolve(res.data.result);
        }).catch(function (err) {
            reject(err.response.data);
        });
    });
}

function bulkInsert(collectionId, items) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + "/wixData", {
            "token": wdToken,
            "version": version,
            "type": "bulk_insert",
            "collectionId": collectionId,
            "items": items
        }).then(function (res) {
            resolve(res.data.result);
        }).catch(function (err) {
            reject(err.response.data);
        });
    });
}

function update(collectionId, item) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + "/wixData", {
            "token": wdToken,
            "version": version,
            "type": "update",
            "collectionId": collectionId,
            "item": item
        }).then(function (res) {
            resolve(res.data.result);
        }).catch(function (err) {
            reject(err.response.data);
        });
    });
}

function bulkUpdate(collectionId, items) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + "/wixData", {
            "token": wdToken,
            "version": version,
            "type": "bulk_update",
            "collectionId": collectionId,
            "items": items
        }).then(function (res) {
            resolve(res.data.result);
        }).catch(function (err) {
            reject(err.response.data);
        });
    });
}

function remove(collectionId, itemId) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + "/wixData", {
            "token": wdToken,
            "version": version,
            "type": "remove",
            "collectionId": collectionId,
            "itemId": itemId
        }).then(function (res) {
            resolve(res.data.result);
        }).catch(function (err) {
            reject(err.response.data);
        });
    });
}

function bulkRemove(collectionId, itemIds) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + "/wixData", {
            "token": wdToken,
            "version": version,
            "type": "bulk_remove",
            "collectionId": collectionId,
            "itemIds": itemIds
        }).then(function (res) {
            resolve(res.data.result);
        }).catch(function (err) {
            reject(err.response.data);
        });
    });
}

module.exports = {
    baseUrl,
    token: wdToken,
    version,
    setup,
    enableDevMode,
    disableDevMode
};