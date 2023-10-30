import express from "express";

const router = express.Router();

import {
  createCategory,
  listCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  upload,
} from "../controller/categoryController.js";

router.post("/", createCategory);
router.get("/", listCategories);
router.get("/:id", getCategory);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);
router.post("/upload", upload.single("image"), uploadImage);

export default router;
