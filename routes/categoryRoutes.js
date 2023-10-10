import express from "express";

const router = express.Router();

import { createCategory, listCategories, getCategory, updateCategory, deleteCategory } from "../controller/categoryController.js"

router.post('/', createCategory);
router.get('/', listCategories);
router.get('/:id', getCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;