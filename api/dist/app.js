"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const http_errors_1 = __importStar(require("http-errors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
const noteRoutes_1 = __importDefault(require("./dRoutes/noteRoutes"));
const userRoutes_1 = __importDefault(require("./dRoutes/userRoutes"));
const verifySessionCookie_1 = require("./middleware/verifySessionCookie");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.enable('trust proxy');
// const dirname = path.resolve();
const dirname = path_1.default.dirname(path_1.default.resolve());
// const parentDirname = path.dirname(dirname);
// const newPath = path.join(parentDirname, path.basename(dirname));
// console.log(newPath);
// we initialize the session method before routes so that all routes can access the session functions
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_WORD,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for Heroku & Digital Ocean (regarding X-Forwarded-For)
    name: 'MyCoolWebAppCookieName', // This needs to be unique per-host.
    cookie: {
        // secure: true, // required for cookies to work on HTTPS
        httpOnly: false,
        sameSite: 'none',
        maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.DATABASE
    })
}));
// const corsOptions = {
//   origin: "https://note-management-ovgat0io2-aniket-panchals-projects.vercel.app", // frontend URI (ReactJS)
//   credentials: true // Allows session cookies to be sent from frontend to backend 
// }
// app.use(cors(
//   corsOptions
//   ));
// routes
app.use("/api/users", userRoutes_1.default);
app.use("/api/notes", verifySessionCookie_1.VerifySession, noteRoutes_1.default);
// use the frontend app
app.use(express_1.default.static(path_1.default.join(dirname, "/app/dist")));
console.log(dirname);
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(dirname, '/app/dist/index.html'));
});
app.get("/", (req, res, next) => {
    try {
        res.status(200).json({
            message: "Note-Management api is live ",
            creator: "Aniket panchal (me)"
        });
    }
    catch (error) {
        next(error);
    }
});
// end point middleware
app.use((res, req, next) => {
    // next(Error("endpoint not found"));
    next((0, http_errors_1.default)(404, "endpoint not found"));
});
// error handler middleware
app.use((error, req, res, next) => {
    console.error(error);
    let errorMessage = "an unknown error occurred";
    let statusCode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
exports.default = app;
