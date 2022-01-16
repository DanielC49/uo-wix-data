import { ok, badRequest } from 'wix-http-functions';
import wixData from 'wix-data';

const wdToken = "foobar";

export function post_wixData(request) {
    const response = {
        "headers": {
            "Content-Type": "application/json"
        }
    };

    return request.body.text().then((body) => {
        body = JSON.parse(body);

        const UOWD_VERSION = 2;

        if (body.token !== wdToken) {
            response.body = {
                "status": "failed",
                "error": "invalid_token"
            }
            return badRequest(response);
        }

        const type = body.type;

        if (!type) {
            response.body = {
                "status": "failed",
                "error": "type_not_provided"
            }
            return badRequest(response);
        }

        if (!body.version || body.version < UOWD_VERSION) {
            response.body = {
                "status": "failed",
                "error": "invalid_version"
            }
            return badRequest(response);
        }

        if (type.startsWith("query.")) {
            let query = wixData.query(body.collectionId);
            for (let i = 0; i < body.query.length; i++) {
                switch (body.query[i].type) {
                case "eq":
                    query = query.eq(body.query[i].property, body.query[i].value);
                    break;
                case "ne":
                    query = query.ne(body.query[i].property, body.query[i].value);
                    break;
                case "gt":
                    query = query.gt(body.query[i].property, body.query[i].value);
                    break;
                case "ge":
                    query = query.ge(body.query[i].property, body.query[i].value);
                    break;
                case "lt":
                    query = query.lt(body.query[i].property, body.query[i].value);
                    break;
                case "le":
                    query = query.le(body.query[i].property, body.query[i].value);
                    break;
                case "between":
                    query = query.between(body.query[i].property, body.query[i].start, body.query[i].end);
                    break;
                case "contains":
                    query = query.eq(body.query[i].property, body.query[i].string);
                    break;
                case "startsWith":
                    query = query.startsWith(body.query[i].property, body.query[i].string);
                    break;
                case "endsWith":
                    query = query.endsWith(body.query[i].property, body.query[i].string);
                    break;
                case "hasAll":
                    query = query.hasAll(body.query[i].property, body.query[i].value);
                    break;
                case "hasSome":
                    query = query.hasSome(body.query[i].property, body.query[i].value);
                    break;
                case "isEmpty":
                    query = query.isEmpty(body.query[i].property);
                    break;
                case "isNotEmpty":
                    query = query.isNotEmpty(body.query[i].property);
                    break;
                case "ascending":
                    query = query.ascending(body.query[i].property);
                    break;
                case "descending":
                    query = query.descending(body.query[i].property);
                    break;
                case "limit":
                    query = query.limit(body.query[i].limit);
                    break;
                case "include":
                    query = query.include(body.query[i].property);
                    break;
                default:
                    response.body = {
                        "status": "failed",
                        "error": "invalid_query_type"
                    }
                    return badRequest(response);
                }
            }
            if (type == "query.find") {
                return query.find().then((result) => {
                    response.body = {
                        "status": "success",
                        "result": result
                    }
                    return ok(response);
                }).catch((error) => {
                    response.body = {
                        "status": "failed",
                        "error": "find_failed",
                        "errorMessage": error
                    }
                    return badRequest(response);
                });
            } else if (type == "query.count") {
                return query.count().then((result) => {
                    response.body = {
                        "status": "success",
                        "result": result
                    }
                    return ok(response);
                }).catch((error) => {
                    response.body = {
                        "status": "failed",
                        "error": "count_failed",
                        "errorMessage": error
                    }
                    return badRequest(response);
                });
            }
        } else if (type == "get") {
            return wixData.get(body.collectionId, body.itemId).then((item) => {
                response.body = {
                    "status": "success",
                    "result": item
                }
                return ok(response);
            }).catch((error) => {
                response.body = {
                    "status": "failed",
                    "error": "get_failed",
                    "errorMessage": error
                }
                return badRequest(response);
            });
        } else if (type == "insert") {
            return wixData.insert(body.collectionId, body.item).then((item) => {
                response.body = {
                    "status": "success",
                    "result": item
                }
                return ok(response);
            }).catch((error) => {
                response.body = {
                    "status": "failed",
                    "error": "insert_failed",
                    "errorMessage": error
                }
                return badRequest(response);
            });
        } else if (type == "bulk_insert") {
            return wixData.bulkInsert(body.collectionId, body.items).then((res) => {
                response.body = {
                    "status": "success",
                    "result": res
                }
                return ok(response);
            }).catch((error) => {
                response.body = {
                    "status": "failed",
                    "error": "insert_failed",
                    "errorMessage": error
                }
                return badRequest(response);
            });
        } else if (type == "update") {
            return wixData.update(body.collectionId, body.item).then((item) => {
                response.body = {
                    "status": "success",
                    "result": item
                }
                return ok(response);
            }).catch((error) => {
                response.body = {
                    "status": "failed",
                    "error": "update_failed",
                    "errorMessage": error
                }
                return badRequest(response);
            });
        } else if (type == "bulk_update") {
            return wixData.bulkUpdate(body.collectionId, body.items).then((res) => {
                response.body = {
                    "status": "success",
                    "result": res
                }
                return ok(response);
            }).catch((error) => {
                response.body = {
                    "status": "failed",
                    "error": "bulk_update_failed",
                    "errorMessage": error
                }
                return badRequest(response);
            });
        } else if (type == "remove") {
            return wixData.remove(body.collectionId, body.itemId).then((item) => {
                response.body = {
                    "status": "success",
                    "result": item
                }
                return ok(response);
            }).catch((error) => {
                response.body = {
                    "status": "failed",
                    "error": "remove_failed",
                    "errorMessage": error
                }
                return badRequest(response);
            });
        } else if (type == "bulk_remove") {
            return wixData.bulkRemove(body.collectionId, body.itemIds).then((res) => {
                response.body = {
                    "status": "success",
                    "result": res
                }
                return ok(response);
            }).catch((error) => {
                response.body = {
                    "status": "failed",
                    "error": "bulk_remove_failed",
                    "errorMessage": error
                }
                return badRequest(response);
            });
        } else {
            response.body = {
                "status": "failed",
                "error": "invalid_type"
            }
            return badRequest(response);
        }
    });
}
