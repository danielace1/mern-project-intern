import express from "express";
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/auth.controller.js";
import validateForgotPassword from "../middleware/validateForgotPassword.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotPassword", validateForgotPassword, forgotPassword);
router.post("/resetPassword/:id/:token", resetPassword);

export default router;
