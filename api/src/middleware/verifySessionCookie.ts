import { RequestHandler } from "express";
import createHttpError from "http-errors";


export const VerifySession: RequestHandler = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        next(createHttpError(401, "user is not authenticated from auth.ts MW"))
    }
}
