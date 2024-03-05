import mongoose from "mongoose";
let { model, Schema } = mongoose;
let ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    desc: { type: String, required: true },
    img: {
      type: [String],
      required: true,
    },
    categories: {
      type: [String],
      required: true,
    },
    size: { type: [String], required: true },
    colors: {
      type: [String],
      required: true,
    },
    old_price: {
      type: Number,
      default: 0,
    },
    new_price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
export default model("Product", ProductSchema);
