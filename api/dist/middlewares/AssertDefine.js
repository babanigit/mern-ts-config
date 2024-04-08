"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsDefine = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
function assertIsDefine(val) {
    if (!val) {
        // throw new Error("Expected 'val' to be defined, but received " + val);
        throw (0, http_errors_1.default)(404, " req.session.userId notFound(MW)");
    }
}
exports.assertIsDefine = assertIsDefine;
