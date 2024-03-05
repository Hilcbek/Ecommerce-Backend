import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import { ErrorMessage } from "../Error/error.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import crypto from "crypto";
export let Register = asyncHandler(async (req, res, next) => {
  try {
    let { username, email } = req.body;
    if (!username || !email || !req.body.password)
      return next(ErrorMessage(500, "All credentials required!"));
    if (!validator.isEmail(email))
      return next(ErrorMessage(500, "wrong email address!"));
    let Username = await User.findOne({ username: username });
    if (Username) return next(ErrorMessage(500, "username is taken!"));
    let Email = await User.findOne({ email: email });
    if (Email) return next(ErrorMessage(500, "email already in use!"));
    if (!validator.isStrongPassword(req.body.password))
      return next(ErrorMessage(500, "weak password!"));
    let genSalt = await bcrypt.genSalt(10);
    let newUser = await User.create({
      ...req.body,
      password: await bcrypt.hash(req.body.password, genSalt),
    });
    let { password, ...Info } = newUser._doc;
    res.status(200).json({ data: Info });
  } catch (error) {
    next(error);
  }
});
export let Login = asyncHandler(async (req, res, next) => {
  try {
    let { username } = req.body;
    if (!username || !req.body.password)
      return next(ErrorMessage(500, "All credentials required!"));
    let UserStatus = await User.find({
      $or: [
        {
          username: username,
        },
        {
          email: username,
        },
      ],
    });
    if (!UserStatus[0]) return next(ErrorMessage(500, "Wrong username!"));
    let Password = await bcrypt.compare(
      req.body.password,
      UserStatus[0].password
    );
    if (!Password) return next(ErrorMessage(500, "Wrong credentials!"));
    const tokenPayload = {
      _id: UserStatus[0]._id,
      isAdmin: UserStatus[0].isAdmin,
      username: UserStatus[0].username,
    };
    var expiresIn = 60 * 60 * 24 * 1000;
    let token = jwt.sign(tokenPayload, process.env.JWT, { expiresIn });
    const { password, ...info } = UserStatus[0]._doc;
    res.status(200).json({ data: { ...info, token } });
  } catch (error) {
    next(error);
  }
});
export let LoginWithGoogleProvider = asyncHandler(async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.username)
      return next(ErrorMessage(500, "Provide an information!"));
    let UserFound = await User.findOne({
      email: req.body.email,
    });
    if (UserFound) {
      const tokenPayload = {
        _id: UserFound._id,
        isAdmin: UserFound.isAdmin,
        username: UserFound.username,
      };
      const expiresIn = 3600 * 24; // 1 hour in seconds
      let token = jwt.sign(tokenPayload, process.env.JWT, { expiresIn });
      let { password, ...Info } = UserFound._doc;
      res.status(200).json({ ...Info, token });
    } else {
      let fixed = crypto.randomBytes(64).toString("hex").slice(-5);
      let passwordRandom = crypto.randomBytes(64).toString("hex");
      let { username, email } = req.body;
      if (!username || !email)
        return next(ErrorMessage(500, "provide all the information!"));
      let genSalt = await bcrypt.genSalt(10);
      username = username + fixed;
      let newUser = await User.create({
        ...req.body,
        username: username,
        email: email,
        password: await bcrypt.hash(passwordRandom, genSalt),
      });
      let { password, ...UserFound } = newUser._doc;

      const tokenPayload = {
        _id: UserFound._id,
        isAdmin: UserFound.isAdmin,
        username: UserFound.username,
      };
      const expiresIn = 3600 * 24;
      let token = jwt.sign(tokenPayload, process.env.JWT, { expiresIn });
      res.status(200).json({ ...UserFound, token });
    }
  } catch (error) {
    next(error);
  }
});
export let Logout = (req, res, next) => {
  try {
    res.clearCookie("token").status(200).json({ data: "user logged out!" });
  } catch (error) {
    next(error);
  }
};
