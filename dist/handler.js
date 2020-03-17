"use strict";
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
var path = require("path");
var fsModule = require("./fs");
var yamlParser = require("./yaml-parse");
var test = require("./test");
var configLoader_1 = require("./configLoader");
/**
 * Main function. Fired when command was called
 * @param dir [optional] Target directory
 * @param cmd The command, including all flags
 */
exports.start = function (dir, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var testFiles, testFileAmount, colorizedTestFileAmount, testSettings, validateSchema, amountOfValidSchemas, colorizedAmountOfValidSchemas, validTests, _i, _a, erroredSchema, responseCode;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log();
                if (!cmd.bulk) return [3 /*break*/, 2];
                return [4 /*yield*/, fsModule.getBulk(dir)];
            case 1:
                testFiles = _b.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, fsModule.findTestFiles(dir)];
            case 3:
                testFiles = _b.sent();
                _b.label = 4;
            case 4:
                if (testFiles === null) {
                    exports.writeErrorMessage("Path " + chalk_1.default.underline(path.join(process.cwd(), dir)) + " does not exist");
                    return [2 /*return*/, 1];
                }
                testFileAmount = testFiles.length;
                colorizedTestFileAmount = exports.colorizeMain(testFileAmount.toString());
                if (testFileAmount === 0) {
                    exports.writeMessage(chalk_1.default.hex(configLoader_1.config.secondaryColor)('No testing files found'));
                    console.log();
                    return [2 /*return*/, 1];
                }
                exports.writeMessage("Found " + colorizedTestFileAmount + " test file(s)");
                testSettings = yamlParser.parseTestingFiles(testFiles, dir);
                validateSchema = yamlParser.validateSchema(testSettings);
                amountOfValidSchemas = validateSchema.proofedSettings.length;
                colorizedAmountOfValidSchemas = exports.colorizeMain(amountOfValidSchemas.toString());
                if (amountOfValidSchemas < testFileAmount) {
                    colorizedAmountOfValidSchemas = exports.colorizeCustomRed(amountOfValidSchemas.toString());
                }
                exports.writeMessage("Schema validation: " + colorizedAmountOfValidSchemas + " of " + colorizedTestFileAmount + " file(s) passed");
                validTests = validateSchema.proofedSettings;
                if (validateSchema.errors.length > 0) {
                    for (_i = 0, _a = validateSchema.errors; _i < _a.length; _i++) {
                        erroredSchema = _a[_i];
                        exports.writeErrorMessage("Schema validation failed: " + JSON.stringify(erroredSchema.details, null, 2));
                    }
                    if (!cmd.noExit) {
                        return [2 /*return*/, 1];
                    }
                }
                console.log();
                return [4 /*yield*/, test.performTests(validTests, cmd)];
            case 5:
                responseCode = _b.sent();
                return [2 /*return*/, responseCode];
        }
    });
}); };
/**
 * Print out a formatted message
 * @param message
 */
exports.writeMessage = function (message, isBold) {
    if (isBold === false) {
        console.log("[ " + exports.colorizeMain(chalk_1.default.bold('Strest')) + " ] " + message);
        return;
    }
    console.log("[ " + exports.colorizeMain(chalk_1.default.bold('Strest')) + " ] " + chalk_1.default.bold(message));
};
/**
 * Print out a formatted message in red
 * @param message
 */
exports.writeErrorMessage = function (message) {
    exports.writeMessage(exports.colorizeCustomRed(message));
};
/**
 * Give the given string a color of #2ed573
 * @param message
 */
exports.colorizeMain = function (message) {
    return chalk_1.default.hex(configLoader_1.config.primaryColor)(message);
};
/**
 * Give the given string a color of #ff4757
 * @param message
 */
exports.colorizeCustomRed = function (message) {
    return chalk_1.default.hex(configLoader_1.config.errorColor)(message);
};
