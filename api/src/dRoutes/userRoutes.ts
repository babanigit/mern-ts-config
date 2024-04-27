import express, { Express, Response, Request } from "express";

import User from "../models/userSchema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

import {getAuthenticatedUser, getRegister, getLogin,getLogout } from "../controllers/userController";
import { VerifySession } from "../middleware/verifySessionCookie";

// /api/users

// authenticate
router.get("/", VerifySession, getAuthenticatedUser);
// Registration
router.route("/register").post(getRegister)
// login
router.route("/login").post(getLogin)
// logout
router.route("/logout").post(getLogout)

export default router;