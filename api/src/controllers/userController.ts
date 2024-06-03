// all the functionality will come here

import express, { Response, Request, response, NextFunction, RequestHandler } from "express";
import { Document } from "mongoose";
import User from "../models/userSchema";
import bcrypt from "bcrypt";
import { error } from "console";
import createHttpError from "http-errors";

import jwt,{JwtPayload} from "jsonwebtoken"

import { assertIsDefine } from "../utils/assertIsDefine";

// Define your user interface if needed
interface User extends Document {
  _id: string;
  userName: string;
  email: string;
  passwd: string;
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {

  try {
    const getCookieAuth = req.cookies.access_token;

    assertIsDefine("cookie", getCookieAuth);

    // Type assertion to JwtPayload (haven't used yet)
    const decoded = jwt.verify(
      getCookieAuth,
      process.env.SECRET!
    ) as JwtPayload;

    res.status(200).json(decoded.user);

  } catch (error) {
    next(error)
    console.log("error from controller/getAuth")
    console.error(error)
  }
}

export const getRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userName, email, passwd } = await req.body;
    if (!userName || !email || !passwd)
      throw createHttpError(400, "parameters missing");

    const existingUserEmail = await User.findOne({ email: email });
    if (existingUserEmail)
      throw createHttpError(409, "email is already taken!")

    const existingUserUserName = await User.findOne({ userName: userName });
    if (existingUserUserName)
      throw createHttpError(409, "username is already taken!")

    // password hashing
    const hashedPasswd = await bcrypt.hash(passwd, 10);

    const user = await User.create({
      userName,
      email,
      passwd: hashedPasswd,
      // cPasswd: hashedPasswd,
    });

    console.log("registered user is:  ", user)

    // generating token
    const token = jwt.sign(
      {
        id: user!._id,
        user: user,
      },
      process.env.SECRET_WORD!
    );

    // // we sending user._id to the session.userId and we are creating cookie of it
    // req.session.userId = user._id;

    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200).json(user);

  } catch (error) {
    console.error(error);
    next(error)
  }
};

export const getLogin = async (req: Request, res: Response, next: NextFunction) => {

  const { userName, passwd } = await req.body;

  try {
    if (!userName || !passwd)
      throw createHttpError(400, "Parameters missing")

    const user = await User.findOne({ userName: userName }).select("+passwd +email").exec();

    if (!user)
      throw createHttpError(401, "invalid credentials")

    if (typeof passwd !== 'string' || typeof user.passwd !== 'string')
      throw new Error("Password or user password is not a string");

    const passwdMatch = await bcrypt.compare(passwd, user.passwd);

    if (!passwdMatch)
      throw createHttpError(401, "invalid credentials")

    // generating token
    const token = jwt.sign(
      {
        id: user!._id,
        user: user,
      },
      process.env.SECRET_WORD!
    );

    // // we sending user._id to the session.userId
    // req.session.userId = user._id;

    const expiryDate = new Date(Date.now() + 3600000); // 1 hour
    // const expiryDate = new Date(Date.now() + 30000); // 30 seconds
    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200).json(user);

  } catch (error) {

    next(error)
    console.error(error);
  }
};

export const getLogout: RequestHandler = (req, res, next) => {

  try {
    res.clearCookie("access_token").status(200).json({
      success: true,
      message: "User Logged out successfully",
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
  
}

