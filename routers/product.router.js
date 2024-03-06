import express from "express";
import {
  AddProduct,
  AllProduct,
  LoadTenProducts,
  SingleProduct,
} from "../controller/product.controller.js";
import { VerifyAdmin } from "../Token/token.js";
export let productRouter = express.Router();
productRouter.post("/addProduct", VerifyAdmin,AddProduct);
productRouter.get('/', AllProduct)
productRouter.get('/:id', SingleProduct)
productRouter.get('/load/get-Product', LoadTenProducts)