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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander_1 = require("commander");
var shelljs_1 = __importDefault(require("shelljs"));
var chalk_1 = __importDefault(require("chalk"));
var inquirer_1 = __importDefault(require("inquirer"));
var checkout = new commander_1.Command("checkout");
var isCurrentBranch = function (branch) { return branch[0] === "*"; };
checkout
    .description("switch git branch")
    .argument("[branch]", "branch name (regex)")
    .option("-a, --all", "include remote branch")
    .action(function (filter) { return __awaiter(void 0, void 0, void 0, function () {
    var options, cmd, result, branches, branch;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = checkout.opts();
                cmd = "git branch " + (options.all ? "-a" : "") + " " + (filter ? "| grep " + filter : "");
                result = shelljs_1.default.exec(cmd, { silent: true });
                if (result.code !== 0) {
                    console.error(result.stderr);
                    return [2 /*return*/];
                }
                branches = result
                    .trim()
                    .split("\n")
                    .map(function (line) { return line.trim(); });
                return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            type: "rawlist",
                            name: "branch",
                            prefix: ">",
                            message: "which branch do you want to checkout?",
                            pageSize: 10,
                            choices: branches.map(function (single) { return ({
                                name: isCurrentBranch(single) ? chalk_1.default.green(single) : single,
                                value: single,
                            }); }),
                            default: branches.find(isCurrentBranch),
                            filter: function (answer) { return answer.replace("remotes/origin/", "").trim(); },
                        },
                    ])];
            case 1:
                branch = (_a.sent()).branch;
                if (!isCurrentBranch(branch))
                    shelljs_1.default.exec("git switch " + branch);
                return [2 /*return*/];
        }
    });
}); });
exports.default = checkout;
