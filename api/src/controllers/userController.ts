// all the functionality will come here

import express, { Response, Request, response, NextFunction, RequestHandler } from "express";
import { Document } from "mongoose";
import User from "../models/userSchema";
import bcrypt from "bcrypt";
import { error } from "console";
import createHttpError from "http-errors";
import { assertIsDefine } from "../utils/assertIsDefine";



export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {

  try {
    const userId = req.session.userId; // Access the userId directly from req.session

    console.log("session Id ", userId);
    console.log("session is ", req.session);

    const user = await User.findById(userId).select("+email").exec();

    console.log("getAuth from userController ", user);

    res.status(200).json(user);

  } catch (error) {
    next(error)
    console.log("error from controller/getAuth")
    console.error(error)
  }
}


// interface User {
//   _id: string;
//   userName: string;
//   email: string;
//   passwd: string;
//   cPasswd: string;
//   createdAt: Date;
//   updatedAt: Date;
//   __v: number;
// }



// Define your user interface if needed
interface User extends Document {
  _id: string;
  userName: string;
  email: string;
  passwd: string;
}


const getRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userName, email, passwd } = await req.body;
    if (!userName || !email || !passwd) {

      throw createHttpError(400, "parameters missing");

    }

    else {

      const existingUserEmail = await User.findOne({ email: email });
      if (existingUserEmail) {

        throw createHttpError(409, "email is already taken!")

      }

      const existingUserUserName = await User.findOne({ userName: userName });
      if (existingUserUserName) {

        throw createHttpError(409, "username is already taken!")
      }

      else {

        // password hashing
        const hashedPasswd = await bcrypt.hash(passwd, 10);

        const user = await User.create({
          userName,
          email,
          passwd: hashedPasswd,
          // cPasswd: hashedPasswd,
        });


        // we sending user._id to the session.userId
        req.session.userId = user._id;

        res.status(200).json(user);
      }
    }

  } catch (error) {
    console.error(error);
    next(error)
  }
};

interface IUser {
  passwd?: string;
  userName?: string;
}


const getLogin = async (req: Request, res: Response, next: NextFunction) => {


  const { userName, passwd } = await req.body;

  try {
    if (!userName || !passwd) {

      throw createHttpError(400, "Parameters missing")


    } else {
      const user = await User.findOne({ userName: userName }).select("+passwd +email").exec();

      if (!user) {
        throw createHttpError(401, "invalid credentials")
      }

      if (typeof passwd !== 'string' || typeof user.passwd !== 'string') {
        throw new Error("Password or user password is not a string");
      }

      console.log("user.pass", passwd, user.passwd)

      const passwdMatch = await bcrypt.compare(passwd, user.passwd);

      if (!passwdMatch) {
        throw createHttpError(401, "invalid credentials")
      }


      // we sending user._id to the session.userId
      req.session.userId = user._id;

      res.status(200).json(user);


    }
  } catch (error) {

    next(error)
    console.error(error);
  }
};

// logout
export const getLogout: RequestHandler = (req, res, next) => {

  // will destroy the session here....
  req.session.destroy(error => {
    if (error) {
      next(error)
    } else {
      res.sendStatus(200);
    }
  })
}


export {
  getRegister,
  getLogin,

};
