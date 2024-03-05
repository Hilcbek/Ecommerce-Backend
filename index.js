import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoose from "mongoose";
import { authRouter } from "./routers/auth.router.js";
import { userRouter } from "./routers/user.router.js";
import { productRouter } from "./routers/product.router.js";
import { paymentRouter } from "./routers/Stripe.router.js";
let app = express();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://ecommerce-app-iota-green.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);
app.use(cookieParser(process.env.JWT));
app.use(morgan("dev"));
let PORT = process.env.PORT || 5500;
let MONGOOSE_URL = process.env.MONGOOSE_URL;
mongoose
  .connect(MONGOOSE_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
mongoose.connection.on("connected", () => console.log(`db is running!`));
mongoose.connection.on("disconnected", () =>
  console.log(`db stopped running!`)
);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/checkout", paymentRouter);
app.use((err, req, res, next) => {
  let errorMessage = err.message || "Something went wrong!";
  let errorStatus = err.status || 500;
  res.status(errorStatus).json({ error: errorMessage });
});
