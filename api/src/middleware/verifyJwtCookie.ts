import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

// Extend the Request interface to include the user property
// declare global {
//   namespace Express {
//     interface Request {
//       user?: any; // Define the user property
//     }
//   }
// }

// Define a new interface extending Request
interface AuthenticatedRequest extends Request {
  user?: any; // Define the user property
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.access_token;

    if (!token) throw createHttpError(401, "you are not authenticated! jwt token ");

    if (!process.env.SECRET_WORD) {
      throw createHttpError(404, " Access token secret not found or undefined (VU)");
    }

    // verify token
    jwt.verify(token, process.env.SECRET_WORD, (err: any, user: any) => {
      if (err) throw createHttpError(403, "token is not valid! ");
      req.user = user;
      next();
    });

  } catch (error) {
    next(error);
  }
}
