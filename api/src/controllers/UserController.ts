import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import UserModel from "../models/UserSchema";


export const getAuthUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.session.userId; // Access the userId directly from req.session

        console.log("session Id form getAuthUser ", userId);
        console.log("session is ", req.session);

        const user = await UserModel.findById(userId).select("+email").exec();

        console.log("getAuth from userController ", user);

        res.status(200).json(user);

    } catch (error) {
        next(error)
    }

}

export const getRegister = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const { username, email, password } = await req.body;
        if (!username || !email || !password) throw createHttpError(400, "parameters missing");

        const existingUserEmail = await UserModel.findOne({ email: email });
        if (existingUserEmail) throw createHttpError(409, "email is already taken!")

        // password hashing
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
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


    } catch (error) {
        next(error)
    }
}

interface CustomSessionData {
    userId: unknown; // Define the userId property
}

declare module 'express-session' {
    interface SessionData extends CustomSessionData { }
}

export const getLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { username, password } = await req.body;
        if (!username || !password) throw createHttpError(400, "Parameters missing")

        const user = await UserModel.findOne({ username: username }).select("+password +email").exec();
        if (!user) throw createHttpError(401, "invalid credentials(u)")

        if (typeof password !== 'string' || typeof user.password !== 'string') throw new Error("Password or user password is not a string");

        const passwdMatch = await bcrypt.compare(password, user.password);
        if (!passwdMatch) throw createHttpError(401, "invalid credentials(p)")


        req.session.userId = user._id;

        console.log( "form getLogin" ,user._id)


        // res.status(201).json({
        //     user,
        //     success: true,
        //     message: "User logged in",
        // });

        res.status(200).json(user);


    } catch (error) {
        next(error)
    }

}

export const getLogOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        // will destroy the session here....
        req.session.destroy(error => {
            if (error) {
                next(error)
            } else {
                res.sendStatus(200);
            }
        })

    } catch (error) {
        next(error)
    }

}
