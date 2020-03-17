"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var os = require("os");
var path = require("path");
var yamlLoader = require("js-yaml");
var chalk_1 = require("chalk");
exports.config = {
    primaryColor: '#2ed573',
    errorColor: '#ff4757',
    secondaryColor: '#576574'
};
exports.loadConfig = function () {
    var homedir = os.homedir();
    var configPath = '.strestConfig.yml';
    var p = path.join(homedir, configPath);
    if (fs.existsSync(p)) {
        if (fs.statSync(p).isFile()) {
            try {
                var parsed = yamlLoader.safeLoad(fs.readFileSync(p, 'utf8'));
                if (typeof parsed.config !== 'undefined' && parsed.config !== null) {
                    if (typeof parsed.config.primaryColor !== 'undefined' && parsed.config.primaryColor !== null) {
                        exports.config.primaryColor = parsed.config.primaryColor;
                    }
                    if (typeof parsed.config.errorColor !== 'undefined' && parsed.config.errorColor !== null) {
                        exports.config.errorColor = parsed.config.errorColor;
                    }
                    if (typeof parsed.config.secondaryColor !== 'undefined' && parsed.config.secondaryColor !== null) {
                        exports.config.secondaryColor = parsed.config.secondaryColor;
                    }
                }
            }
            catch (e) {
                console.log(chalk_1.default.red('Config bad formatted \n'));
            }
        }
    }
};
