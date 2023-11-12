import express from "express";

const router = express.Router();

import {
  createProduct,
  listProducts,
  listProductsByCategory,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  upload,
} from "../controller/productController.js";

router.post("/", createProduct);
router.get("/", listProducts);
router.get("/category/:categoryId", listProductsByCategory);
router.get("/:id", getProduct);
router.put("/:id", upload.single("thumbnail"), updateProduct);
router.delete("/:id", deleteProduct);
router.post("/upload", upload.single("image"), uploadImage);

export default router;
