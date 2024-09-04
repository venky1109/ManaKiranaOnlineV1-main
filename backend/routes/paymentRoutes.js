import express from 'express';
import { createPaymentSession, getOrderStatus, refundOrder } from '../controllers/paymentController.js';
import  { protect ,admin } from '../middleware/authMiddleware.js'; // Import your auth middleware

const router = express.Router();

// Apply authentication middleware to protect routes
router.post('/create-session',protect, createPaymentSession);
router.get('/orders/:order_id', protect, getOrderStatus);
router.post('/orders/:order_id',protect, admin, refundOrder);

export default router;
