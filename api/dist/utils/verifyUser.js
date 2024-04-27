"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token)
        return next((0, http_errors_1.default)(401, 'You are not authenticated!'));
    // verifying token
    jsonwebtoken_1.default.verify(token, process.env.SECRET_WORD, (err, user) => {
        if (err)
            return next((0, http_errors_1.default)(403, 'Token is not valid!'));
        req.user = user;
        next();
    });
};
exports.verifyToken = verifyToken;
