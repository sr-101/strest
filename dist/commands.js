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
var program = require("commander");
var chalk_1 = require("chalk");
var handler = require("./handler");
// Initialize the commander.js CLI commands
var initializeCommands = function () {
    // main command
    program
        .version(require('../package.json').version)
        .usage('[targetFileOrDirectory]')
        .option('-p, --print', 'Print out all response data')
        .option('-o, --output <type>', 'Output the test as a specific equivalent [curl]')
        .option('-n, --no-exit', "Don't exit with code 1 when a request failed")
        .option('-b, --bulk', 'Execute Tests and directories defined in the specified yml')
        .option('-s, --save [file]', 'Saves the results of the executions and variables to file. default: ./strest_history.json', 'strest_history.json')
        .option('-l, --load [file]', 'Loads file to use as input for chained requests. default: ./strest_history.json', 'strest_history.json')
        .option('-k, --key [keyname]', 'Execute a specific key in the file.')
        .action(function (dir, cmd) { return __awaiter(void 0, void 0, void 0, function () {
        var executionStartedTime, exitCode, executionEndedTime, executionTime;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    executionStartedTime = new Date().getTime();
                    if (typeof cmd === 'undefined') {
                        cmd = dir;
                        dir = null;
                    }
                    // workaround for --no-exit option because options with hyphens can't be read
                    cmd.noExit = cmd.rawArgs.includes('-n') || cmd.rawArgs.includes('--no-exit');
                    return [4 /*yield*/, handler.start(dir, cmd)];
                case 1:
                    exitCode = _a.sent();
                    executionEndedTime = new Date().getTime();
                    executionTime = (executionEndedTime - executionStartedTime) / 1000;
                    if (exitCode !== 0) {
                        console.log(handler.colorizeCustomRed(chalk_1.default.bold("[ Strest\u00A0] Failed before finishing all requests")));
                        console.log();
                        // exit code does only take values between 0-255 so it's impossible to set the exit code to like 404
                        process.exit(1);
                    }
                    else {
                        console.log();
                        handler.writeMessage("\u2728  Done in " + chalk_1.default.bold((executionTime).toString() + 's'), false);
                        console.log();
                        process.exit(0);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    program.parse(process.argv);
};
exports.default = initializeCommands;
