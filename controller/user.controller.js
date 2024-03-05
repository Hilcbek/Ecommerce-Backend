import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { ErrorMessage } from "../Error/error.js";
export let UserUpdate = asyncHandler(async (req, res, next) => {
  try {
    if(!req.body) return next(ErrorMessage(500, "At least provide on information to delete!"));
    if (req.user._id !== req.params.id)
      return next(ErrorMessage(500, "You can update your own account only!"));
    let { id } = req.params;
    if (!id) return next(ErrorMessage(500, "provide user id"));
    let UpdatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    let { password, ...info } = UpdatedUser._doc;
    res.status(200).json({ data: info });
  } catch (error) {
    next(error);
  }
});
export let DeleteUser = asyncHandler(async (req, res, next) => {
  try {
    if (req.user._id !== req.params.id)
      return next(ErrorMessage(500, "You can delete your own account only!"));
    let { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ data: "user deleted successfully" });
  } catch (error) {
    next(error);
  }
});
export let getOneUser = asyncHandler(async (req, res, next) => {
  try {
    if (req.user._id !== req.params.id)
      return next(ErrorMessage(500, "You can fetch your own account only!"));
    let { id } = req.params;
    let SingleUser = await User.findOne({ _id: id });
    if(SingleUser){
        let { password, ...Info } = SingleUser._doc;
        res.status(200).json({ data: Info });
    }else{
        res.status(404).json({ data: "User not found with id: " + id });
    }
  } catch (error) {
    next(error);
  }
});
export let getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    if (!req.user.isAdmin)
      return next(
        ErrorMessage(500, "Only admin privileges to fetch all users!")
      );
    let AllUsers = await User.find({});
    let { password, ...Users } = AllUsers[0]._doc;
    res.status(200).json({ data: Users });
  } catch (error) {}
});
