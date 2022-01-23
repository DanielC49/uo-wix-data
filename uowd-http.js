/*
  uo-wix-data
  PPTGames
*/

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

        const params = body.params;

        if (type.startsWith("query.")) {
            let query = wixData.query(params.collectionId);
            for (let i = 0; i < params.query.length; i++) {
                switch (params.query[i].type) {
                case "eq":
                    query = query.eq(params.query[i].property, params.query[i].value);
                    break;
                case "ne":
                    query = query.ne(params.query[i].property, params.query[i].value);
                    break;
                case "gt":
                    query = query.gt(params.query[i].property, params.query[i].value);
                    break;
                case "ge":
                    query = query.ge(params.query[i].property, params.query[i].value);
                    break;
                case "lt":
                    query = query.lt(params.query[i].property, params.query[i].value);
                    break;
                case "le":
                    query = query.le(params.query[i].property, params.query[i].value);
                    break;
                case "between":
                    query = query.between(params.query[i].property, params.query[i].start, params.query[i].end);
                    break;
                case "contains":
                    query = query.eq(params.query[i].property, params.query[i].string);
                    break;
                case "startsWith":
                    query = query.startsWith(params.query[i].property, params.query[i].string);
                    break;
                case "endsWith":
                    query = query.endsWith(params.query[i].property, params.query[i].string);
                    break;
                case "hasAll":
                    query = query.hasAll(params.query[i].property, params.query[i].value);
                    break;
                case "hasSome":
                    query = query.hasSome(params.query[i].property, params.query[i].value);
                    break;
                case "isEmpty":
                    query = query.isEmpty(params.query[i].property);
                    break;
                case "isNotEmpty":
                    query = query.isNotEmpty(params.query[i].property);
                    break;
                case "ascending":
                    query = query.ascending(params.query[i].property);
                    break;
                case "descending":
                    query = query.descending(params.query[i].property);
                    break;
                case "limit":
                    query = query.limit(params.query[i].limit);
                    break;
                case "include":
                    query = query.include.apply(params.query[i].property);
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
                return query.find(params.options).then((res) => {
                    response.body = {
                        "status": "success",
                        "result": res
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
                return query.count(params.options).then((res) => {
                    response.body = {
                        "status": "success",
                        "result": res
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
            return wixData.get(params.collectionId, params.itemId, params.options).then((res) => {
                response.body = {
                    "status": "success",
                    "result": res
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
            return wixData.insert(params.collectionId, params.item, params.options).then((res) => {
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
        } else if (type == "bulk_insert") {
            return wixData.bulkInsert(params.collectionId, params.items, params.options).then((res) => {
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
        } else if (type == "insert_reference") {
            return wixData.insertReference(params.collectionId, params.propertyName, params.referringItem, params.referencedItem, params.options).then((res) => {
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
        } else if (type == "is_referenced") {
            return wixData.isReferenced(params.collectionId, params.propertyName, params.referringItem, params.referencedItem, params.options).then((res) => {
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
        } else if (type == "query_referenced") {
            return wixData.queryReferenced(params.collectionId, params.item, params.propertyName, params.options).then((res) => {
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
            return wixData.update(params.collectionId, params.item, params.options).then((res) => {
                response.body = {
                    "status": "success",
                    "result": res
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
            return wixData.bulkUpdate(params.collectionId, params.items).then((res) => {
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
        } else if (type == "save") {
            return wixData.save(params.collectionId, params.item, params.options).then((res) => {
                response.body = {
                    "status": "success",
                    "result": res
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
        } else if (type == "remove") {
            return wixData.remove(params.collectionId, params.itemId).then((res) => {
                response.body = {
                    "status": "success",
                    "result": res
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
            return wixData.bulkRemove(params.collectionId, params.itemIds).then((res) => {
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
        } else if (type == "remove_reference") {
            return wixData.removeReference(params.collectionId, params.propertyName, params.referringItem, params.referencedItem, params.options).then((res) => {
                response.body = {
                    "status": "success",
                    "result": res
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
        } else if (type == "replace_references") {
            return wixData.replaceReferences(params.collectionId, params.propertyName, params.referringItem, params.referencedItem, params.options).then((res) => {
                response.body = {
                    "status": "success",
                    "result": res
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
        } else {
            response.body = {
                "status": "failed",
                "error": "invalid_type"
            }
            return badRequest(response);
        }
    });
}