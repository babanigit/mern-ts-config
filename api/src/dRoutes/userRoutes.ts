import express from "express";

const router = express.Router();

import {getAuthenticatedUser, getRegister, getLogin,getLogout } from "../controllers/userController";
import { verifyToken } from "../middleware/verifyJwtCookie";

// /api/users

// authenticate
router.get("/", verifyToken, getAuthenticatedUser);
// Registration
router.route("/register").post(getRegister)
// login
router.route("/login").post(getLogin)
// logout
router.route("/logout").post(getLogout)

export default router;