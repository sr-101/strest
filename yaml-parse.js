"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Joi = require("joi");
var yaml = require("js-yaml");
var fs = require("fs");
var path = require("path");
var handler_1 = require("./handler");
var configSchema_1 = require("./configSchema");
/**
 * Read and parse the test files to JSON
 * @param pathArray Array of the test-config files
 * @param dir Directory for execution
 */
exports.parseTestingFiles = function (pathArray, dir) {
    var responseData = [];
    pathArray.map(function (filePath) {
        try {
            if (typeof filePath === 'string') {
                var data = fs.readFileSync(filePath.toString(), 'utf8');
                var parsed = yaml.safeLoad(data);
                var fileName = path.parse(filePath).name;
                var removeFilename = path.dirname(filePath) + path.sep;
                if (dir === null) {
                    dir = '';
                }
                parsed.raw = data.replace(/(\rn|\n|\r)/g, '\n');
                parsed.fileName = fileName;
                parsed.relativePath = removeFilename.replace(path.join(process.cwd(), dir), '.' + path.sep);
                responseData.push(parsed);
            }
        }
        catch (e) {
            handler_1.writeErrorMessage("An error occured while parsing " + path.relative(process.cwd(), filePath));
            handler_1.writeErrorMessage(e);
        }
    });
    return responseData;
};
exports.validateSchema = function (testSettings) {
    var proofedSettings = [];
    var errors = [];
    testSettings.map(function (fileSetting) {
        var test = Joi.validate(fileSetting, configSchema_1.Schema);
        if (test.error === null) {
            proofedSettings.push(fileSetting);
        }
        else {
            errors.push(test.error);
        }
    });
    return { proofedSettings: proofedSettings, errors: errors };
};
