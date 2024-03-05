import jwt from "jsonwebtoken";
import { ErrorMessage } from "../Error/error.js";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
export let VerifyLoggedInUser = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return next(ErrorMessage(403, "Sign in to your account!"));
    jwt.verify(token, process.env.JWT, (err, payload) => {
      if (err) return next(ErrorMessage(401, "token expired!"));
      req.user = payload;
      next();
    });
  } catch (error) {
    next(error);
  }
};
export let VerifyAdmin = (req, res, next) => {
  try {
    VerifyLoggedInUser(req, res, () => {
      if (!req.user?.isAdmin) return next(ErrorMessage(500, "Not authorized!"));
      next();
    });
  } catch (error) {
    next(error);
  }
};
