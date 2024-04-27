import jwt from 'jsonwebtoken';
// import { errorHandler } from './error.js';
import { NextFunction,Request,Response } from 'express';
import createHttpError from 'http-errors';

// Define a new interface extending Request
interface AuthenticatedRequest extends Request {
    user?: any; // Define the user property
}

export const verifyToken = (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) return next(createHttpError(401, 'You are not authenticated!'));

    // verifying token
    jwt.verify(token, process.env.SECRET_WORD!, (err: any, user: any) => {
        if (err) return next(createHttpError(403, 'Token is not valid!'));

        req.user = user;
        next();
    });


}