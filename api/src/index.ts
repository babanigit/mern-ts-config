// imports
import express, { Response, Request, NextFunction } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from "cors";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser"
import session from "express-session";
import createHttpError, { isHttpError } from "http-errors";
import dotenv from "dotenv";

import userRoute from "./routers/UserRoutes"

dotenv.config({ path: "../.env" });

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT;
const DB = process.env.DATABASE;

// const dirname = path.resolve();
// console.log("direname : ",dirname)


const dirname2 = path.dirname(path.resolve());
console.log("dirname2 : ", dirname2)
// const parentDirname = path.dirname(dirname2);
// const newPath = path.join(parentDirname, path.basename(dirname2));
// console.log(newPath);


// connection
const connectDb = async (): Promise<void> => {

    if (!DB) {
        throw new Error("Database connection string is not provided. -b");
    }

    try {
        const connect = await mongoose.connect(DB);
        console.log(
            "database connected: ",
            connect.connection.host,
            connect.connection.name
        );

    } catch (error) {
        console.error("failed to connect to the database");
        console.error(error)
    }

};
connectDb();


// session

// routes
app.use("/api/users", userRoute)



// use the frontend app
app.use(express.static(path.join(dirname2, "/app/dist")));
app.get('*', (req, res) => {
    res.sendFile(path.join(dirname2, '/app/dist/index.html'));
});

// default route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            message: "mern ts setup",
            creator: "Aniket panchal (me)"
        });
    } catch (error) {
        next(error);
    }
});

// end point middleware
app.use((res, req, next) => {
    next(createHttpError(404, "endpoint not found"))
});

// error handling 
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    let errorMessage = "an unknown error occurred(default non-httpError error)";
    let statusCode = 500;

    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }

    // console log
    console.error("[error log...] ", error);

    // default error response
    res
        .status(statusCode)
        .json({
            success: false,
            message: errorMessage,
            statusCode,
        })
});

// listing
app.listen(port, () => {
    console.log(
        `[server]: hello, Server is running at http://localhost:${port}`
    );
});