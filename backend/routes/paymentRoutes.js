import express from 'express';

import { createPaymentSession, getOrderStatus, refundOrder } from '../controllers/paymentController.js';
import { protect,admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to create a payment session
router.post('/session', protect,createPaymentSession);

// Route to get order status
router.get('/orders/:order_id', protect,getOrderStatus);

// Route to refund an order
router.post('/orders/:order_id/refunds', protect,admin,refundOrder);

export default router; // Use default export