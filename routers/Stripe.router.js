import express from "express";
import { PaymentController } from "../controller/Stripe.controller.js";
import { VerifyLoggedInUser } from "../Token/token.js";
export let paymentRouter = express.Router();
paymentRouter.post("/", VerifyLoggedInUser, PaymentController);
