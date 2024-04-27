"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controllers/userController");
const verifyJwtCookie_1 = require("../middleware/verifyJwtCookie");
// /api/users
// authenticate
router.get("/", verifyJwtCookie_1.verifyToken, userController_1.getAuthenticatedUser);
// Registration
router.route("/register").post(userController_1.getRegister);
// login
router.route("/login").post(userController_1.getLogin);
// logout
router.route("/logout").post(userController_1.getLogout);
exports.default = router;
