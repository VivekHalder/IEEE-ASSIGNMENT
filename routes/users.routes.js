import { Router } from "express";
import { signupUser, loginUser, logoutUser } from "../controllers/user.controllers.js";

const router = Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

export default router;