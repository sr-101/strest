#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commands_1 = require("./commands");
var configLoader_1 = require("./configLoader");
// Allow Docker container process to exit
process.on('SIGINT', function () {
    process.exit(0);
});
configLoader_1.loadConfig();
commands_1.default();
