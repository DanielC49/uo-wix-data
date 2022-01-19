const axios = require("axios");

const version = 3;

let baseUrl;
let wdToken;
let data;

function setup(username, siteName, token) {
    data = {
        username,
        siteName
    };
    baseUrl = "https://" + username + ".wixsite.com/" + siteName + "/_functions/";
    wdToken = token;
    return {
        get,
        query,
        insert,
        bulkInsert,
        insertReference,
        isReferenced,
        queryReferenced,
        update,
        bulkUpdate,
        save,
        remove,
        bulkRemove,
        removeReference,
        replaceReferences
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
    include(...propertyName) {
        this.#query.push({ "type": "include", "property": propertyName });
        return this;
    }
    find() {
        return executeFunc("query.find", {
            "collectionId": this.#collectionId,
            "query": this.#query
        });
    }
    count() {
        return executeFunc("query.count", {
            "collectionId": this.#collectionId,
            "query": this.#query
        });
    }
}

function query(collectionId) {
    let query = new WixDataQuery(collectionId);
    return query;
}

function get(collectionId, itemId, options) {
    return executeFunc("get", {
        collectionId,
        itemId,
        options
    });
}

function insert(collectionId, item, options) {
    return executeFunc("insert", {
        collectionId,
        item,
        options
    });
}

function bulkInsert(collectionId, items, options) {
    return executeFunc("bulk_insert", {
        collectionId,
        items,
        options
    });
}

function insertReference(collectionId, propertyName, referringItem, referencedItem, options) {
    return executeFunc("insert_reference", {
        collectionId,
        propertyName,
        referringItem,
        referencedItem,
        options
    });
}

function isReferenced(collectionId, propertyName, referringItem, referencedItem, options) {
    return executeFunc("is_reference", {
        collectionId,
        propertyName,
        referringItem,
        referencedItem,
        options
    });
}

function queryReferenced(collectionId, item, propertyName, options) {
    return executeFunc("query_reference", {
        collectionId,
        item,
        propertyName,
        options,
        options
    });
}

function update(collectionId, item, options) {
    return executeFunc("update", {
        collectionId,
        item,
        options
    });
}

function bulkUpdate(collectionId, items, options) {
    return executeFunc("bulk_update", {
        collectionId,
        items,
        options
    });
}

function save(collectionId, item, options) {
    return executeFunc("save", {
        collectionId,
        item,
        options
    });
}

function remove(collectionId, itemId, options) {
    return executeFunc("remove", {
        collectionId,
        itemId,
        options
    });
}

function bulkRemove(collectionId, itemIds, options) {
    return executeFunc("bulk_remove", {
        collectionId,
        itemIds,
        options
    });
}

function removeReference(collectionId, propertyName, referringItem, referencedItem, options) {
    return executeFunc("remove_reference", {
        collectionId,
        propertyName,
        referringItem,
        referencedItem,
        options
    });
}

function replaceReferences(collectionId, propertyName, referringItem, referencedItem, options) {
    return executeFunc("replace_references", {
        collectionId,
        propertyName,
        referringItem,
        referencedItem,
        options
    });
}

function executeFunc(func, params) {
    return new Promise((resolve, reject) => {
        axios.post(baseUrl + "/wixData", {
            "token": wdToken,
            "version": version,
            "type": func,
            "params": params
        }).then((res) => {
            resolve(res.data.result);
        }).catch((err) => {
            if (err.response.status == 404) {
                reject("ERROR: Could not connect.\nCheck if the username and site name are correct, and if you have the http-functions.js file on the site.");
            } else {
                reject(err.response.data);
            }
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