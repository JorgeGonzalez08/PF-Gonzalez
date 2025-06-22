import { Router } from "express";
import ProductController from "../controllers/product.controller.js";

export const productsRouter = Router();
const productController = new ProductController();


productsRouter.get('/', productController.getProducts);

productsRouter.get("/:pid", productController.getProduct);

productsRouter.post("/", productController.newProduct);

productsRouter.put("/:pid", productController.productUpdate);

productsRouter.delete("/:pid", productController.productDelete)

