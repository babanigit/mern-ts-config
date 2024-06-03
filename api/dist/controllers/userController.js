"use strict";
// all the functionality will come here
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogout = exports.getLogin = exports.getRegister = exports.getAuthenticatedUser = void 0;
const userSchema_1 = __importDefault(require("../models/userSchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_errors_1 = __importDefault(require("http-errors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const assertIsDefine_1 = require("../utils/assertIsDefine");
const getAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getCookieAuth = req.cookies.access_token;
        (0, assertIsDefine_1.assertIsDefine)("cookie", getCookieAuth);
        // Type assertion to JwtPayload (haven't used yet)
        const decoded = jsonwebtoken_1.default.verify(getCookieAuth, process.env.SECRET);
        res.status(200).json(decoded.user);
    }
    catch (error) {
        next(error);
        console.log("error from controller/getAuth");
        console.error(error);
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
const getRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, passwd } = yield req.body;
        if (!userName || !email || !passwd)
            throw (0, http_errors_1.default)(400, "parameters missing");
        const existingUserEmail = yield userSchema_1.default.findOne({ email: email });
        if (existingUserEmail)
            throw (0, http_errors_1.default)(409, "email is already taken!");
        const existingUserUserName = yield userSchema_1.default.findOne({ userName: userName });
        if (existingUserUserName)
            throw (0, http_errors_1.default)(409, "username is already taken!");
        // password hashing
        const hashedPasswd = yield bcrypt_1.default.hash(passwd, 10);
        const user = yield userSchema_1.default.create({
            userName,
            email,
            passwd: hashedPasswd,
            // cPasswd: hashedPasswd,
        });
        console.log("registered user is:  ", user);
        // generating token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            user: user,
        }, process.env.SECRET_WORD);
        // // we sending user._id to the session.userId and we are creating cookie of it
        // req.session.userId = user._id;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        res
            .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
            .status(200).json(user);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.getRegister = getRegister;
const getLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, passwd } = yield req.body;
    try {
        if (!userName || !passwd)
            throw (0, http_errors_1.default)(400, "Parameters missing");
        const user = yield userSchema_1.default.findOne({ userName: userName }).select("+passwd +email").exec();
        if (!user)
            throw (0, http_errors_1.default)(401, "invalid credentials");
        if (typeof passwd !== 'string' || typeof user.passwd !== 'string')
            throw new Error("Password or user password is not a string");
        const passwdMatch = yield bcrypt_1.default.compare(passwd, user.passwd);
        if (!passwdMatch)
            throw (0, http_errors_1.default)(401, "invalid credentials");
        // generating token
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            user: user,
        }, process.env.SECRET_WORD);
        // // we sending user._id to the session.userId
        // req.session.userId = user._id;
        const expiryDate = new Date(Date.now() + 3600000); // 1 hour
        // const expiryDate = new Date(Date.now() + 30000); // 30 seconds
        res
            .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
            .status(200).json(user);
    }
    catch (error) {
        next(error);
        console.error(error);
    }
});
exports.getLogin = getLogin;
const getLogout = (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json({
            success: true,
            message: "User Logged out successfully",
            statusCode: 200,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getLogout = getLogout;
