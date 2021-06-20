import { ok, badRequest } from 'wix-http-functions';
import wixData from 'wix-data';

// URL to call this HTTP function from your published site looks like: 
// Premium site - https://mysite.com/_functions/example/multiply?leftOperand=3&rightOperand=4
// Free site - https://username.wixsite.com/mysite/_functions/example/multiply?leftOperand=3&rightOperand=4

// URL to test this HTTP function from your saved site looks like:
// Premium site - https://mysite.com/_functions-dev/example/multiply?leftOperand=3&rightOperand=4
// Free site - https://username.wixsite.com/mysite/_functions-dev/example/multiply?leftOperand=3&rightOperand=4

const wdToken = "1234";

export function post_wixData(request) {
    const response = {
        "headers": {
            "Content-Type": "application/json"
        }
    };

    return request.body.text().then((body) => {
        body = JSON.parse(body);

        if (body.token !== wdToken) {
            response.body = {
                "status": "failed",
                "error": "token_invalid"
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

        if (type == "query.find") {
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
                default:
                    response.body = {
                        "status": "failed",
                        "error": "query_type_invalid"
                    }
                    return badRequest(response);
                }
            }
            return query.find().then((result) => {
                response.body = {
                    "status": "success",
                    "result": result
                }
                return ok(response);
            }).catch((error) => {
                response.body = {
                    "status": "failed",
                    "error": "query_failed",
                    "errorMessage": error
                }
                return badRequest(response);
            });
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
        } else {
            response.body = {
                "status": "failed",
                "error": "type_invalid"
            }
            return badRequest(response);
        }
    });
}
