import express from "express";

const router = express.Router();

import { createOrderFromCart, listOrders, getOrder, cancelOrder } from "../controller/orderController.js"

router.post('/', createOrderFromCart);
router.get('/', listOrders);
router.get('/:id', getOrder);
router.delete('/:id', cancelOrder);

export default router;