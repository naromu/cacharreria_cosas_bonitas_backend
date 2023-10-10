import express from "express";
const router = express.Router();

import { 
    getCart, 
    addItemToCart, 
    updateCartItem, 
    removeItemFromCart, 
    emptyCart 
} from "../controller/cartController.js";

router.get('/', getCart);

router.post('/', addItemToCart);

router.put('/item/:id', updateCartItem);

router.delete('/item/:id', removeItemFromCart);

router.delete('/empty', emptyCart);

export default router;
