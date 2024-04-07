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
