"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const router = express_1.default.Router();
// authenticate
router.get("/", UserController_1.getAuthUser);
// Registration
router.route("/register").post(UserController_1.getRegister);
// login
router.route("/login").post(UserController_1.getLogin);
// logout
router.route("/logout").post(UserController_1.getLogOut);
exports.default = router;
