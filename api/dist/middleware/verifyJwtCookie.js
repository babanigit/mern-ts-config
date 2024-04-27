"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_errors_1 = __importDefault(require("http-errors"));
const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        if (!token)
            throw (0, http_errors_1.default)(401, "you are not authenticated! jwt token ");
        if (!process.env.SECRET_WORD) {
            throw (0, http_errors_1.default)(404, " Access token secret not found or undefined (VU)");
        }
        // verify token
        jsonwebtoken_1.default.verify(token, process.env.SECRET_WORD, (err, user) => {
            if (err)
                throw (0, http_errors_1.default)(403, "token is not valid! ");
            req.user = user;
            next();
        });
    }
    catch (error) {
        next(error);
    }
};
exports.verifyToken = verifyToken;
