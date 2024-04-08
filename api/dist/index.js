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
// imports
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const http_errors_1 = __importStar(require("http-errors"));
const dotenv_1 = __importDefault(require("dotenv"));
const UserRoutes_1 = __importDefault(require("./routers/UserRoutes"));
const NoteRoutes_1 = __importDefault(require("./routers/NoteRoutes"));
dotenv_1.default.config({ path: "../.env" });
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
const port = process.env.PORT;
const DB = process.env.DATABASE;
const directory = path_1.default.dirname(path_1.default.resolve());
const corsOptions = {
    origin: "http://localhost:5173", // frontend URI (ReactJS)
    credentials: true // Allows session cookies to be sent from frontend to backend 
};
// connection
const connectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!DB) {
        throw new Error("Database connection string is not provided. -b");
    }
    try {
        const connect = yield mongoose_1.default.connect(DB);
        console.log("database connected: ", connect.connection.host, connect.connection.name);
    }
    catch (error) {
        console.error("failed to connect to the database");
        console.error(error);
    }
});
connectDb();
// session
// we initialize the session method before routes so that all routes can access the session functions
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_WORD,
    resave: false,
    saveUninitialized: false,
    proxy: true, // Required for Heroku & Digital Ocean (regarding X-Forwarded-For)
    name: 'hellosessionbroo', // This needs to be unique per-host.
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
// cors
app.use((0, cors_1.default)(corsOptions));
// routes
app.use("/api/users", UserRoutes_1.default);
app.use("/api/notes", NoteRoutes_1.default);
// use the frontend app
app.use(express_1.default.static(path_1.default.join(directory, "/app/dist")));
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(directory, '/app/dist/index.html'));
});
// default route
app.get("/", (req, res, next) => {
    try {
        res.status(200).json({
            message: "mern ts setup",
            creator: "Aniket panchal (me)"
        });
    }
    catch (error) {
        next(error);
    }
});
// end point middleware
app.use((res, req, next) => {
    next((0, http_errors_1.default)(404, "endpoint not found"));
});
// error handling 
app.use((error, req, res, next) => {
    // default res
    let errorMessage = "an unknown error occurred(default non-httpError error)";
    let statusCode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    // console log
    console.error("[error log...] ", error);
    // error response
    res
        .status(statusCode)
        .json({
        success: false,
        message: errorMessage,
        statusCode,
    });
});
// listing
app.listen(port, () => {
    console.log(`[server]: hello, Server is running at http://localhost:${port}`);
});
