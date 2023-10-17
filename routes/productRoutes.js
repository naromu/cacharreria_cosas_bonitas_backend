import express from "express";

const router = express.Router();

import { createProduct, listProducts, listProductsByCategory, getProduct, updateProduct, deleteProduct } from "../controller/productController.js"

router.post('/', createProduct);
router.get('/', listProducts);
router.get('/category/:categoryId', listProductsByCategory);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;