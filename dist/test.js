"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = require("chalk");
var Joi = require("joi");
var ora = require("ora");
var axios_1 = require("axios");
var faker = require("faker");
var handler_1 = require("./handler");
var configLoader_1 = require("./configLoader");
var jp = require("jsonpath");
var nunjucks = require("nunjucks");
var yaml = require("js-yaml");
var jsonfile = require("jsonfile");
var path = require("path");
var Ajv = require("ajv");
var timers_1 = require("timers");
var deepEql = require("deep-eql");
var lineNumber = require('line-number');
var getLineFromPos = require('get-line-from-pos');
require('request-to-curl');
var nunjucksEnv = nunjucks.configure(".", {
    tags: {
        blockStart: '<%',
        blockEnd: '%>',
        variableStart: '<$',
        variableEnd: '$>',
        commentStart: '<#',
        commentEnd: '#>'
    },
    throwOnUndefined: true,
    autoescape: false
});
nunjucksEnv.addGlobal('Faker', function (faked) {
    return faker.fake("{{" + faked + "}}");
});
nunjucksEnv.addGlobal('Env', function (envi) {
    var environ = process.env[envi];
    return environ;
});
nunjucksEnv.addGlobal('ExtFunc', function (func) {
    var args = [];
    if (func.hasOwnProperty('args')) {
        args = func.args;
    }
    var resp = null;
    var respFunc = require(process.cwd() + path.sep + func.name);
    resp = respFunc.default(args);
    return resp.trim();
});
/**
 * All Data that any request returns, will be stored here. After that it can be used in the following methods
 */
var requestReponses = new Map();
// The manually defined variables
// Usable through <% variableName %>
var definedVariables = {};
/**
 * Main handler that will perform the tests with each valid test object
 * @param testObjects
 * @param printAll If true, all response information will be logged in the console
 */
exports.performTests = function (testObjects, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var testObject, abortBecauseTestFailed, printAll, toCurl, fileMap, curPath, _i, testObjects_1, requests, _loop_1, _a, _b, _c, requestName, state_1, fileName, fileMap_1, definedVariablesMap, resultOrder;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                abortBecauseTestFailed = false;
                printAll = cmd.print;
                toCurl = cmd.output == 'curl';
                // Load existing objects
                if (cmd.load) {
                    fileMap = new Map();
                    try {
                        fileMap = new Map(Object.entries(jsonfile.readFileSync(cmd.load)));
                    }
                    catch (_e) {
                        // Oh well, but whatever...
                    }
                    fileMap.forEach(function (value, key) {
                        requestReponses.set(key, value);
                    });
                }
                curPath = "./";
                if (testObjects.length > 1) {
                    console.log(chalk_1.default.blueBright("Executing tests in " + curPath));
                }
                _i = 0, testObjects_1 = testObjects;
                _d.label = 1;
            case 1:
                if (!(_i < testObjects_1.length)) return [3 /*break*/, 6];
                testObject = testObjects_1[_i];
                if (testObject['allowInsecure']) {
                    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
                }
                if (testObject['variables']) {
                    // merge the existing variables with the new to allow multiple testfiles
                    // to use variables from previous files
                    definedVariables = __assign(__assign({}, definedVariables), testObject['variables']);
                }
                if (curPath != testObject.relativePath && testObjects.length > 1) {
                    console.log(chalk_1.default.blueBright("Executing tests in: " + testObject.relativePath));
                }
                curPath = testObject.relativePath;
                if (!!abortBecauseTestFailed) return [3 /*break*/, 5];
                requests = testObject['requests'];
                _loop_1 = function (requestName) {
                    var bypass, val_1, runTimes, i, waitSpinner, spinner, startTime, result, error, requestReponsesObj, keys, nextIndex, nextRequest, computed, endTime, execTime, har, dataString;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                bypass = false;
                                if (cmd.key) {
                                    bypass = true;
                                    if (cmd.key == requestName) {
                                        bypass = false;
                                    }
                                }
                                if (!(!abortBecauseTestFailed && !bypass)) return [3 /*break*/, 11];
                                val_1 = requests[requestName];
                                runTimes = 1;
                                if (typeof val_1.maxRetries !== 'undefined') {
                                    runTimes = val_1.maxRetries;
                                }
                                i = 0;
                                _a.label = 1;
                            case 1:
                                if (!(i != runTimes)) return [3 /*break*/, 11];
                                if (!(typeof val_1.delay !== 'undefined')) return [3 /*break*/, 3];
                                waitSpinner = ora("Waiting for " + chalk_1.default.bold(handler_1.colorizeMain(val_1.delay.toString())) + " milliseconds").start();
                                return [4 /*yield*/, function () {
                                        return new Promise(function (resolve) { return timers_1.setTimeout(resolve, val_1.delay); });
                                    }()];
                            case 2:
                                _a.sent();
                                waitSpinner.stop();
                                _a.label = 3;
                            case 3:
                                spinner = ora("Testing " + chalk_1.default.bold(handler_1.colorizeMain(requestName))).start();
                                startTime = new Date().getTime();
                                result = "succeeded";
                                error = null;
                                requestReponsesObj = Array.from(requestReponses.entries()).reduce(function (main, _a) {
                                    var _b;
                                    var key = _a[0], value = _a[1];
                                    return (__assign(__assign({}, main), (_b = {}, _b[key] = value, _b)));
                                }, {});
                                keys = Object.keys(requests);
                                nextIndex = keys.indexOf(requestName) + 1;
                                nextRequest = keys[nextIndex];
                                computed = exports.computeRequestObject(requestReponsesObj, testObject.raw, requestName, nextRequest, testObject.fileName);
                                if (computed.error) {
                                    error = { isError: true, message: computed.message, har: null, code: 0 };
                                }
                                if (!(error == null)) return [3 /*break*/, 9];
                                if (!(typeof computed.parsed.if !== 'undefined')) return [3 /*break*/, 7];
                                if (!(computed.parsed.if.operand == computed.parsed.if.equals)) return [3 /*break*/, 5];
                                return [4 /*yield*/, performRequest(computed.parsed, requestName, printAll)];
                            case 4:
                                error = _a.sent();
                                return [3 /*break*/, 6];
                            case 5:
                                result = "skipped";
                                error = { isError: false, message: null, har: null, code: 0 };
                                _a.label = 6;
                            case 6: return [3 /*break*/, 9];
                            case 7: return [4 /*yield*/, performRequest(computed.parsed, requestName, printAll)];
                            case 8:
                                error = _a.sent();
                                _a.label = 9;
                            case 9:
                                endTime = new Date().getTime();
                                execTime = (endTime - startTime) / 1000;
                                if (error.isError === true) {
                                    if (runTimes === 1) {
                                        spinner.clear();
                                        spinner.fail(handler_1.colorizeCustomRed("Testing " + chalk_1.default.bold(handler_1.colorizeCustomRed(requestName)) + " failed (" + chalk_1.default.bold(execTime.toString() + "s") + ") \n" + error.message + "\n"));
                                        if (error.curl) {
                                            console.log("Request: " + JSON.stringify(error.curl, null, 2));
                                        }
                                        console.log("Response: \n" + JSON.stringify(error.har, null, 2));
                                        if (!cmd.noExit) {
                                            return [2 /*return*/, { value: 1 }];
                                        }
                                    }
                                    else {
                                        if (runTimes - 1 === i) {
                                            spinner.fail(handler_1.colorizeCustomRed("Testing " + chalk_1.default.bold(handler_1.colorizeCustomRed(requestName)) + " failed to validate within " + chalk_1.default.bold(handler_1.colorizeCustomRed(runTimes.toString())) + " (" + chalk_1.default.bold(execTime.toString() + "s") + ") \n" + error.message + "\n"));
                                            abortBecauseTestFailed = true;
                                            if (!cmd.noExit) {
                                                return [2 /*return*/, { value: 1 }];
                                            }
                                        }
                                        else {
                                            spinner.fail(handler_1.colorizeCustomRed("Testing " + chalk_1.default.bold(handler_1.colorizeCustomRed(requestName)) + " failed to validate. Retrying (" + chalk_1.default.bold((runTimes - i).toString()) + ")... (" + chalk_1.default.bold(execTime.toString() + "s") + ") \n" + error.message + "\n"));
                                            // if the result should be logged
                                            if (val_1.log === true || val_1.log == 'true' || printAll === true) {
                                                console.log("Response: \n" + JSON.stringify(error.har, null, 2));
                                            }
                                            return [3 /*break*/, 10];
                                        }
                                    }
                                }
                                else {
                                    har = error.har;
                                    if (har) {
                                        dataString = '';
                                        if ('content' in har) {
                                            dataString = "\n\n" + handler_1.colorizeMain('Content') + ": \n\n" + chalk_1.default.hex(configLoader_1.config.secondaryColor)(JSON.stringify(har.content, null, 2)) + "\n";
                                        }
                                        else {
                                            dataString = "\n\n" + handler_1.colorizeMain('Content') + ": No Content received\n";
                                        }
                                        spinner.succeed("Testing " + chalk_1.default.bold(handler_1.colorizeMain(requestName)) + " " + result + " (" + chalk_1.default.bold(execTime.toString() + "s") + ")" +
                                            ("\n\n" + handler_1.colorizeMain('Status') + ": " + har.status) +
                                            ("\n" + handler_1.colorizeMain('Status Text') + ": " + har.statusText) +
                                            ("\n\n" + handler_1.colorizeMain('Headers') + ": \n\n" + chalk_1.default.hex(configLoader_1.config.secondaryColor)(JSON.stringify(har.headers, null, 2))) +
                                            ("" + dataString));
                                    }
                                    else {
                                        if (result === "skipped") {
                                            spinner.succeed("Skipped Testing " + chalk_1.default.bold(handler_1.colorizeMain(requestName)) + " " + result + " (" + chalk_1.default.bold(execTime.toString() + "s") + ")");
                                        }
                                        else {
                                            spinner.succeed("Testing " + chalk_1.default.bold(handler_1.colorizeMain(requestName)) + " " + result + " (" + chalk_1.default.bold(execTime.toString() + "s") + ")");
                                        }
                                    }
                                }
                                if (val_1.validate == null && val_1.maxRetries > 0) {
                                    return [3 /*break*/, 10];
                                }
                                if (toCurl === true) {
                                    console.log("\n" + handler_1.colorizeMain('Curl Equivalent: ') + chalk_1.default.grey(error.curl) + "\n");
                                }
                                return [3 /*break*/, 11];
                            case 10:
                                i++;
                                return [3 /*break*/, 1];
                            case 11: return [2 /*return*/];
                        }
                    });
                };
                _a = [];
                for (_b in requests)
                    _a.push(_b);
                _c = 0;
                _d.label = 2;
            case 2:
                if (!(_c < _a.length)) return [3 /*break*/, 5];
                requestName = _a[_c];
                return [5 /*yield**/, _loop_1(requestName)];
            case 3:
                state_1 = _d.sent();
                if (typeof state_1 === "object")
                    return [2 /*return*/, state_1.value];
                _d.label = 4;
            case 4:
                _c++;
                return [3 /*break*/, 2];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6:
                if (cmd.save) {
                    fileName = void 0;
                    if (cmd.save.substring(0, 1) == "/") {
                        fileName = cmd.save;
                    }
                    else {
                        fileName = path.join(process.cwd(), cmd.save);
                    }
                    fileMap_1 = new Map();
                    try {
                        fileMap_1 = new Map(Object.entries(jsonfile.readFileSync(fileName)));
                    }
                    catch (_f) {
                        // Oh well, but whatever...
                    }
                    definedVariablesMap = new Map(Object.entries(definedVariables));
                    definedVariablesMap.forEach(function (value, key) {
                        fileMap_1.set(key, value);
                    });
                    requestReponses.forEach(function (value, key) {
                        fileMap_1.set(key, value);
                    });
                    resultOrder = Array.from(fileMap_1.entries()).reduce(function (main, _a) {
                        var _b;
                        var key = _a[0], value = _a[1];
                        return (__assign(__assign({}, main), (_b = {}, _b[key] = value, _b)));
                    }, {});
                    jsonfile.writeFileSync(fileName, resultOrder, { spaces: 2, EOL: '\r\n' });
                }
                return [2 /*return*/, 0];
        }
    });
}); };
/**
 * Use nunjucks to replace and update the object
 * @param obj working obj
 */
exports.computeRequestObject = function (r, raw, requestName, nextRequest, fileName) {
    var merged = __assign(__assign({}, r), definedVariables);
    nunjucksEnv.addGlobal('JsonPath', function (path) {
        return jp.value(merged, path);
    });
    nunjucksEnv.addGlobal('Filename', function () {
        return fileName ? fileName.replace('.strest', '') : '';
    });
    // Parse obj using nunjucks
    try {
        var regexpStart = new RegExp("^\\s{1,6}" + requestName + ":", "gm");
        var regexpEnd = new RegExp("^\\s{1,6}" + nextRequest + ":", "gm");
        var last = getLineFromPos(raw, -1);
        var start = lineNumber(raw, regexpStart);
        var end = lineNumber(raw, regexpEnd);
        start = start[0].number;
        if (end == "") {
            end = last + 1;
        }
        else {
            end = end[0].number;
        }
        var lines = raw.split("\n");
        var newRaw = lines.slice(start, end - 1).join("\n");
        var converted = nunjucksEnv.renderString(newRaw, merged);
        var parsed = yaml.load(converted);
        return { parsed: parsed, error: null };
    }
    catch (e) {
        var err = validationError("Failed to process " + requestName + " request line using nunjucks:\n " + e);
        return { parsed: null, error: true, message: err };
    }
};
/**
 * Print out a formatted Validation error
 */
var validationError = function (message) {
    return "[ Validation ] " + message;
};
/**
 * Checks whether a type matches the dataToProof
 * @param type
 * @param dataToProof
 */
exports.validateType = function (type, dataToProof) {
    function isType(elem) {
        switch (elem.toLowerCase()) {
            // strings
            case "string":
                return Joi.validate(dataToProof, Joi.string()).error === null;
            case "string.hex":
                return Joi.validate(dataToProof, Joi.string().hex()).error === null;
            case "string.email":
                return Joi.validate(dataToProof, Joi.string().email()).error === null;
            case "string.ip":
                return Joi.validate(dataToProof, Joi.string().ip()).error === null;
            case "string.url":
            case "string.uri":
                return Joi.validate(dataToProof, Joi.string().uri()).error === null;
            case "string.lowercase":
                return Joi.validate(dataToProof, Joi.string().lowercase()).error === null;
            case "string.uppercase":
                return Joi.validate(dataToProof, Joi.string().uppercase()).error === null;
            case "string.base64":
                return Joi.validate(dataToProof, Joi.string().base64()).error === null;
            // boolean
            case "bool":
            case "boolean":
                return Joi.validate(dataToProof, Joi.boolean()).error === null;
            // object
            case "object":
                return Joi.validate(dataToProof, Joi.object()).error === null;
            // array
            case "array":
                return Joi.validate(dataToProof, Joi.array()).error === null;
            // number
            case "number":
                return Joi.validate(dataToProof, Joi.number()).error === null;
            case "number.positive":
                return Joi.validate(dataToProof, Joi.number().positive()).error === null;
            case "number.negative":
                return Joi.validate(dataToProof, Joi.number().negative()).error === null;
            case "null":
                return Joi.validate(dataToProof, Joi.allow(null)).error === null;
            default:
                return false;
        }
    }
    return type.some(isType);
};
/**
 * Perform the Request
 * @param requestObject All config data
 * @param requestName Name of the request
 * @param printAll If true, all response information will be logged in the console
 */
var performRequest = function (requestObject, requestName, printAll) { return __awaiter(void 0, void 0, void 0, function () {
    var axiosObject, username, password, encoded, queryString, _i, _a, item, axiosInstance, response, har, message, _b, _c, validate, jsonPathValue, err, expectResult, valueResult, err, validated, err, ajv, validated, err, regex, validated, err, e_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                axiosObject = {};
                // optional keys
                axiosObject.url = requestObject.request.url;
                axiosObject.method = requestObject.request.method;
                axiosObject.headers = {};
                // headers
                if (typeof requestObject.request.headers !== 'undefined') {
                    requestObject.request.headers.map(function (header) {
                        axiosObject.headers[header.name] = header.value;
                    });
                }
                //Basic Auth
                if (typeof requestObject.auth !== 'undefined') {
                    if (typeof requestObject.auth.basic !== 'undefined') {
                        username = requestObject.auth.basic.username;
                        password = requestObject.auth.basic.password;
                        encoded = Buffer.from(username + ':' + password).toString('base64');
                        axiosObject.headers["Authorization"] = "Basic " + encoded;
                    }
                }
                // queryString
                if (typeof requestObject.request.queryString !== 'undefined') {
                    queryString = "?";
                    for (_i = 0, _a = requestObject.request.queryString; _i < _a.length; _i++) {
                        item = _a[_i];
                        queryString += item.name + "=" + item.value + "&";
                    }
                    axiosObject.url += queryString.slice(0, -1);
                }
                // data
                if (typeof requestObject.request.postData !== 'undefined') {
                    axiosObject.headers["Content-Type"] = requestObject.request.postData.mimeType;
                    if (requestObject.request.postData.text) {
                        axiosObject.data = requestObject.request.postData.text;
                    }
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                axiosInstance = axios_1.default.create({
                    validateStatus: function (status) {
                        return status < 500; // Reject only if the status code is greater than or equal to 500
                    }
                });
                return [4 /*yield*/, axiosInstance(axiosObject)
                    // Convert response to har object structure
                ];
            case 2:
                response = _d.sent();
                har = {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers,
                    content: response.data
                };
                requestReponses.set(requestName, har);
                message = "";
                if ('validate' in requestObject) {
                    for (_b = 0, _c = requestObject.validate; _b < _c.length; _b++) {
                        validate = _c[_b];
                        jsonPathValue = jp.value(har, validate.jsonpath);
                        if (typeof jsonPathValue === 'undefined') {
                            err = validationError("The jsonpath " + chalk_1.default.bold(validate.jsonpath) + " resolved to " + chalk_1.default.bold(typeof jsonPathValue));
                            return [2 /*return*/, { isError: true, har: har, message: err, code: 1, curl: response.request.toCurl() }];
                        }
                        if (validate.expect) {
                            expectResult = validate.expect;
                            valueResult = jsonPathValue;
                            if (typeof validate.expect == "object") {
                                expectResult = JSON.stringify(validate.expect);
                            }
                            if (typeof jsonPathValue == "object") {
                                valueResult = JSON.stringify(jsonPathValue);
                            }
                            if (!deepEql(validate.expect, jsonPathValue)) {
                                err = validationError("The JSON response value should have been " + chalk_1.default.bold(expectResult) + " but instead it was " + chalk_1.default.bold(valueResult));
                                return [2 /*return*/, { isError: true, har: har, message: err, code: 1, curl: response.request.toCurl() }];
                            }
                            else {
                                message = message + "jsonpath " + validate.jsonpath + "(" + expectResult + ")" + " equals " + valueResult + "\n";
                            }
                        }
                        if (validate.type) {
                            validated = exports.validateType(validate.type, jsonPathValue);
                            if (!validated) {
                                err = validationError("The Type should have been " + chalk_1.default.bold(validate.type.toString()) + " but instead it was " + chalk_1.default.bold(typeof jsonPathValue));
                                return [2 /*return*/, { isError: true, har: har, message: err, code: 1, curl: response.request.toCurl() }];
                            }
                            else {
                                message = message + "jsonpath " + validate.jsonpath + "(" + jsonPathValue + ")" + " type equals " + validate.type + "\n";
                            }
                        }
                        if (validate.jsonschema) {
                            ajv = new Ajv();
                            validated = ajv.validate(validate.jsonschema, jsonPathValue);
                            if (!validated) {
                                err = validationError("The jsonschema " + chalk_1.default.bold(JSON.stringify(validate.jsonschema)) + " did not validate against " + chalk_1.default.bold(JSON.stringify(jsonPathValue)));
                                return [2 /*return*/, { isError: true, har: har, message: err, code: 1, curl: response.request.toCurl() }];
                            }
                            else {
                                message = message + "jsonpath " + validate.jsonpath + "(" + jsonPathValue + ")" + " jsonschema validated on " + validate.jsonschema + "\n";
                            }
                        }
                        if (validate.regex) {
                            regex = RegExp(validate.regex);
                            validated = regex.test(jsonPathValue);
                            if (!validated) {
                                err = validationError("The regex " + chalk_1.default.bold(validate.regex.toString()) + " did not return a match against " + chalk_1.default.bold(jsonPathValue));
                                return [2 /*return*/, { isError: true, har: har, message: err, code: 1, curl: response.request.toCurl() }];
                            }
                            else {
                                message = message + "jsonpath " + validate.jsonpath + "(" + jsonPathValue + ")" + " regex return a match on " + validate.regex + "\n";
                            }
                        }
                    }
                }
                // if the result should be logged
                if (requestObject.log === true || requestObject.log == 'true' || printAll === true) {
                    return [2 /*return*/, { isError: false, har: har, message: message, code: 0, curl: response.request.toCurl() }];
                }
                return [2 /*return*/, { isError: false, har: null, message: message, code: 0, curl: response.request.toCurl() }];
            case 3:
                e_1 = _d.sent();
                console.log("\nFailed request object: \n" + JSON.stringify(axiosObject, null, 2));
                return [2 /*return*/, { isError: true, har: null, message: e_1, code: 1 }];
            case 4: return [2 /*return*/];
        }
    });
}); };
