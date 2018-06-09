require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const es = __webpack_require__(21);
const entitiy_type_1 = __webpack_require__(22);
class SearchService {
    constructor(host) {
        this.indexName = 'volunteero-search';
        this.client = new es.Client({
            host,
            log: 'trace'
        });
    }
    createEsParams(entities, mode) {
        let body = [];
        entities.forEach(entity => {
            let moddedPush = {};
            moddedPush[mode] = { _index: this.indexName, _type: 'default', _id: entity.id };
            body.push(moddedPush);
            switch (mode) {
                case entitiy_type_1.EntityType.Create:
                    body.push(entity);
                    break;
                case entitiy_type_1.EntityType.Update:
                    body.push({ doc: entity });
                    break;
            }
        });
        return { body };
    }
    createEntities(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.bulk(this.createEsParams(entities, entitiy_type_1.EntityType.Create));
        });
    }
    updateEntities(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.bulk(this.createEsParams(entities, entitiy_type_1.EntityType.Update));
        });
    }
    deleteEntities(entities) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.bulk(this.createEsParams(entities, entitiy_type_1.EntityType.Delete));
        });
    }
    search(keywords, type = 'any') {
        return __awaiter(this, void 0, void 0, function* () {
            let typedQuery = false;
            let q = '';
            // If there is a preferred entity type, enforce it
            if (type !== 'any') {
                typedQuery = true;
                q += `type:${type}`;
            }
            // If we have keywords, add each one as filter for name and description
            if (keywords.length > 0) {
                if (typedQuery) {
                    q += ' AND (';
                }
                q += keywords.reduce((query, keyword) => {
                    query += ` description:${keyword} OR name:${keyword} OR`;
                    return query;
                }, '');
                q = q.substring(0, q.length - 3);
                if (typedQuery) {
                    q += ')';
                }
            }
            // Do the search
            const result = yield this.client.search({
                index: this.indexName,
                q
            });
            // Sort and split
            const sortedAndCleaned = { events: [], campaigns: [], organizations: [] };
            result.hits.hits
                .sort((a, b) => a._score > b._score)
                .map((hit) => hit._source)
                .forEach(entity => {
                switch (entity.type) {
                    case 'event':
                    case 'organization':
                    case 'campaign':
                        let copy = Object.assign({}, entity);
                        delete copy.type;
                        sortedAndCleaned[entity.type + 's'].push(copy);
                        break;
                }
            });
            return sortedAndCleaned;
        });
    }
}
exports.default = new SearchService('http://ec2-52-59-87-68.eu-central-1.compute.amazonaws.com:9200');


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(5);
const server_1 = __webpack_require__(7);
const routes_1 = __webpack_require__(24);
const port = parseInt(process.env.PORT);
exports.default = new server_1.default()
    .router(routes_1.default)
    .listen(port);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __webpack_require__(6);
dotenv.config();


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(8);
const express = __webpack_require__(0);
const path = __webpack_require__(1);
const bodyParser = __webpack_require__(9);
const http = __webpack_require__(10);
const os = __webpack_require__(11);
const cors = __webpack_require__(12);
const cookieParser = __webpack_require__(13);
const swagger_1 = __webpack_require__(14);
const logger_1 = __webpack_require__(16);
const messaging_service_1 = __webpack_require__(18);
const search_service_1 = __webpack_require__(2);
const cors_1 = __webpack_require__(23);
const app = express();
class ExpressServer {
    constructor() {
        const root = path.normalize(__dirname + '/../..');
        app.set('appPath', root + 'client');
        app.use(cors((req, callback) => {
            callback(null, {
                origin: true,
                credentials: true
            });
        }));
        app.use(cors_1.corsMiddleware);
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser(process.env.SESSION_SECRET));
        app.use(express.static(`${root}/public`));
        messaging_service_1.default.on('ready', () => {
            function getMessagePayload(message) {
                try {
                    let response = JSON.parse(message.content.toString());
                    return response.entities || [];
                }
                catch (e) {
                    return [];
                }
            }
            function handleMessage(ch, message, operationType) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let payload = getMessagePayload(message);
                        switch (operationType) {
                            case 'create':
                                yield search_service_1.default.createEntities(payload);
                                break;
                            case 'update':
                                yield search_service_1.default.updateEntities(payload);
                                break;
                            case 'delete':
                                yield search_service_1.default.deleteEntities(payload);
                                break;
                        }
                    }
                    finally {
                        ch.ack(message);
                    }
                });
            }
            messaging_service_1.default.subscribeToQueue('search.create', (ch, message) => __awaiter(this, void 0, void 0, function* () {
                yield handleMessage(ch, message, 'create');
            }));
            messaging_service_1.default.subscribeToQueue('search.update', (ch, message) => __awaiter(this, void 0, void 0, function* () {
                yield handleMessage(ch, message, 'update');
            }));
            messaging_service_1.default.subscribeToQueue('search.delete', (ch, message) => __awaiter(this, void 0, void 0, function* () {
                yield handleMessage(ch, message, 'delete');
            }));
        });
    }
    router(routes) {
        swagger_1.default(app, routes);
        return this;
    }
    listen(port = parseInt(process.env.PORT)) {
        const welcome = port => () => logger_1.default.info(`up and running in ${"production" || 'development'} @: ${os.hostname()} on port: ${port}}`);
        http.createServer(app).listen(port, welcome(port));
        return app;
    }
}
exports.default = ExpressServer;

/* WEBPACK VAR INJECTION */}.call(exports, "server/common"))

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("express-async-errors");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
Object.defineProperty(exports, "__esModule", { value: true });
const middleware = __webpack_require__(15);
const path = __webpack_require__(1);
function default_1(app, routes) {
    middleware(path.join(__dirname, 'Api.yaml'), app, function (err, middleware) {
        // Enable Express' case-sensitive and strict options
        // (so "/entities", "/Entities", and "/Entities/" are all different)
        app.enable('case sensitive routing');
        app.enable('strict routing');
        app.use(middleware.metadata());
        app.use(middleware.files(app, {
            apiPath: process.env.SWAGGER_API_SPEC,
        }));
        app.use(middleware.parseRequest({
            // Configure the cookie parser to use secure cookies
            cookie: {
                secret: process.env.SESSION_SECRET
            },
            // Don't allow JSON content over 100kb (default is 1mb)
            json: {
                limit: process.env.REQUEST_LIMIT
            }
        }));
        // These two middleware don't have any options (yet)
        app.use(middleware.CORS(), middleware.validateRequest());
        // Error handler to display the validation error as HTML
        app.use(function (err, req, res, next) {
            res.status(err.status || 400).json({
                status: err.status,
                message: err.message.split('\n').join(' ')
            });
        });
        routes(app);
    });
}
exports.default = default_1;

/* WEBPACK VAR INJECTION */}.call(exports, "server/common/swagger"))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("swagger-express-middleware");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const pino = __webpack_require__(17);
const l = pino({
    name: process.env.APP_ID,
    level: process.env.LOG_LEVEL,
});
exports.default = l;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("pino");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const amqp = __webpack_require__(19);
const events = __webpack_require__(20);
class MessagingService extends events.EventEmitter {
    constructor(amqpUrl) {
        super();
        this.amqpUrl = amqpUrl;
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.readConnection = yield amqp.connect(this.amqpUrl);
            this.writeConnection = yield amqp.connect(this.amqpUrl);
            this.emit('ready');
        });
    }
    sendMessage(message, exchangeName, routingKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.logging) {
                console.log('\n------------------------------\n');
                console.log(`Sending to ${exchangeName}:${routingKey}`);
            }
            const channel = yield this.writeConnection.createChannel();
            yield channel.publish(exchangeName, routingKey, new Buffer(JSON.stringify(message)));
        });
    }
    subscribeToQueue(queueName, subscriber) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.writeConnection.createChannel();
            channel.consume(queueName, (message) => {
                if (this.logging) {
                    const payload = JSON.parse(message.content.toString());
                    console.log(`Got message at queue ${queueName} from ${message.fields.exchange} with routing key ${message.fields.routingKey}`);
                    console.log(payload);
                }
                subscriber(channel, message);
            });
        });
    }
    setLogging(enabled) {
        this.logging = enabled;
    }
}
exports.default = new MessagingService('amqp://qgoudwsq:vylnIAdpecjvnlHBBaq7yREurJXzIWX1@duckbill.rmq.cloudamqp.com/qgoudwsq');


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("amqplib");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("elasticsearch");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EntityType;
(function (EntityType) {
    EntityType["Update"] = "update";
    EntityType["Create"] = "index";
    EntityType["Delete"] = "delete";
})(EntityType = exports.EntityType || (exports.EntityType = {}));


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function corsMiddleware(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get('origin'));
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}
exports.corsMiddleware = corsMiddleware;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __webpack_require__(25);
function routes(app) {
    app.use('/api/v1/search', router_1.default);
}
exports.default = routes;
;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(0);
const controller_1 = __webpack_require__(26);
exports.default = express.Router()
    .get('/', controller_1.default.search);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const search_service_1 = __webpack_require__(2);
class Controller {
    search(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isValidInput = Controller.isValidInput(req.query);
            if (!isValidInput.valid) {
                return res.status(400).json({
                    message: 'Invalid input: ' + isValidInput.reason,
                    allowedType: Controller.allowedTypes.join(', ')
                });
            }
            const keywords = req.query.keyword.split(' ');
            const searchResult = yield search_service_1.default.search(keywords, req.query.type);
            return res.status(200).json(Object.assign({}, searchResult));
        });
    }
    static isValidInput(query = {}) {
        if (typeof query.type === 'undefined') {
            return {
                valid: false,
                reason: 'No type specified'
            };
        }
        if (typeof query.keyword === 'undefined') {
            return {
                valid: false,
                reason: 'No keyword specified'
            };
        }
        if (this.allowedTypes.indexOf(query.type) < 0) {
            return {
                valid: false,
                reason: 'Type not supported'
            };
        }
        return {
            valid: true
        };
    }
}
Controller.allowedTypes = ['event', 'campaign', 'organization', 'any'];
exports.Controller = Controller;
exports.default = new Controller();


/***/ })
/******/ ]);
//# sourceMappingURL=main.map