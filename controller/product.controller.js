import { ErrorMessage } from "../Error/error.js";
import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
export let AddProduct = asyncHandler(async (req, res, next) => {
  try {
    let { title, desc, img, categories, size, colors, new_price } = req.body;
    if (
      !title ||
      !desc ||
      !img ||
      !categories ||
      !size ||
      !colors ||
      !new_price
    )
      return next(ErrorMessage(500, "All information is required"));
    let Title = await Product.findOne({ title: title });
    if (Title) return next(ErrorMessage(500, "product is already in stock!"));
    let newProduct = await Product.create(req.body);
    res.status(200).json({ data: newProduct });
  } catch (error) {
    next(error);
  }
});
export let UpdateProduct = asyncHandler(async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!req.user.isAdmin) return next(ErrorMessage(500, "Not Authorized!"));
    let updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ data: updatedProduct });
  } catch (error) {
    next(error);
  }
});
export let DeleteProduct = asyncHandler(async (req, res, next) => {
  try {
    let { id } = req.params;
    if (req.user.isAdmin) return next(ErrorMessage(500, "Not Authorized!"));
    await Product.findByIdAndDelete(id);
    res.status(200).json({ data: "product deleted successfully!" });
  } catch (error) {
    next(error);
  }
});
export let SingleProduct = asyncHandler(async (req, res, next) => {
  try {
    let { id } = req.params;
    let SingleItem = await Product.findById(id);
    res.status(200).json({ data: SingleItem });
  } catch (error) {
    next(error);
  }
});
export let AllProduct = asyncHandler(async (req, res, next) => {
  try {
    const result = await Product.find({});
    res.status(200).json({ data: result });
  } catch (error) {}
});
export let LoadTenProducts = asyncHandler(async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    let skip = (page - 1) * limit;
    let data = await Product.find().skip(parseInt(skip)).limit(parseInt(limit));
    res.status(200).json({ data: data });
  } catch (error) {
    next(error);
  }
});
