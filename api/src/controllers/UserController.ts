import { error } from "console";
import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import UserModel from "../models/UserSchema";


export const getAuthUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {


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

        res.status(201).json({
            user,
            success: true,
            message: "User created successfully",
        });


    } catch (error) {
        next(error)
    }
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


        res.status(201).json({
            user,
            success: true,
            message: "User logged in",
        });


    } catch (error) {
        next(error)
    }

}

export const getLogOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

    } catch (error) {
        next(error)
    }

}
