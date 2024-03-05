import mongoose from "mongoose";
let { model, Schema } = mongoose;
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      min: 4,
      max: 500,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    securityQuestion: {
      type: Object,
      required: true,
      default: {
        "What is your favorite singer ?": "Teddy",
      },
    },
  },
  { timestamps: true }
);
export default model("User", UserSchema);