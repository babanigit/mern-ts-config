import { error } from "console";
import { NextFunction,Request,Response } from "express";
import createHttpError from "http-errors";


export const getAuthUser= async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
    try {
        
    } catch (error) {
        next(error)
    }
    
}

export const getRegister= async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
    try {
        throw error
    } catch (error) {
        next(error)
    }
}

export const getLogin= async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
    try {
        
    } catch (error) {
        next(error)
    }
    
}

export const getLogOut= async (req:Request,res:Response,next:NextFunction) : Promise<void> => {
    try {
        
    } catch (error) {
        next(error)
    }
    
}
