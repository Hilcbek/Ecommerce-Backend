import express from "express";
import {
  Login,
  LoginWithGoogleProvider,
  Logout,
  Register,
} from "../controller/auth.controller.js";
export let authRouter = express.Router();
authRouter.post("/register", Register);
authRouter.post("/login", Login);
authRouter.post("/logout", Logout);
authRouter.post("/google-sign-in", LoginWithGoogleProvider);
