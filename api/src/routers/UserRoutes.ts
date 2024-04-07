import express, { Express, Response, Request } from "express";
import { getAuthUser, getLogin, getLogOut, getRegister } from "../controllers/UserController";

const router = express.Router();


// authenticate
router.get("/",  getAuthUser);
// Registration
router.route("/register").post(getRegister)
// login
router.route("/login").post(getLogin)
// logout
router.route("/logout").post(getLogOut)

export default router;