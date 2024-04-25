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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogOut = exports.getLogin = exports.getRegister = exports.getAuthUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema_1 = __importDefault(require("../models/UserSchema"));
const getAuthUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.session.userId; // Access the userId directly from req.session
        console.log("session Id form getAuthUser ", userId);
        console.log("session is ", req.session);
        const user = yield UserSchema_1.default.findById(userId).select("+email").exec();
        console.log("getAuth from userController ", user);
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthUser = getAuthUser;
const getRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = yield req.body;
        if (!username || !email || !password)
            throw (0, http_errors_1.default)(400, "parameters missing");
        const existingUserEmail = yield UserSchema_1.default.findOne({ email: email });
        if (existingUserEmail)
            throw (0, http_errors_1.default)(409, "email is already taken!");
        // password hashing
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield UserSchema_1.default.create({
            username,
            email,
            password: hashedPassword,
            // cPasswd: hashedPasswd,
        });
        // res.status(201).json({
        //     user,
        //     success: true,
        //     message: "User created successfully",
        // });
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getRegister = getRegister;
const getLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = yield req.body;
        if (!username || !password)
            throw (0, http_errors_1.default)(400, "Parameters missing");
        const user = yield UserSchema_1.default.findOne({ username: username }).select("+password +email").exec();
        if (!user)
            throw (0, http_errors_1.default)(401, "invalid credentials(u)");
        if (typeof password !== 'string' || typeof user.password !== 'string')
            throw new Error("Password or user password is not a string");
        const passwdMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwdMatch)
            throw (0, http_errors_1.default)(401, "invalid credentials(p)");
        req.session.userId = user._id;
        console.log("form getLogin", user._id);
        // res.status(201).json({
        //     user,
        //     success: true,
        //     message: "User logged in",
        // });
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getLogin = getLogin;
const getLogOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // will destroy the session here....
        req.session.destroy(error => {
            if (error) {
                next(error);
            }
            else {
                res.sendStatus(200);
            }
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getLogOut = getLogOut;
