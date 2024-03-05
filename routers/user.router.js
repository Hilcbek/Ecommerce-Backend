import express from "express";
import {
  DeleteUser,
  UserUpdate,
  getAllUsers,
  getOneUser,
} from "../controller/user.controller.js";
import { VerifyAdmin, VerifyLoggedInUser } from "../Token/token.js";
export let userRouter = express.Router();
userRouter.put("/:id", VerifyLoggedInUser, UserUpdate);
userRouter.delete("/:id", VerifyLoggedInUser, DeleteUser);
userRouter.get("/:id", VerifyAdmin, getOneUser);
userRouter.get("/", VerifyAdmin, getAllUsers);
