import express from 'express';
import { createOrder, captureOrder } from '../controllers/paymentController.js';
import {authMiddleware} from '../middlewares/auth.js';

const router = express.Router();

// CREATE ORDER
router.post('/create-order', authMiddleware, createOrder);

// CAPTURE ORDER
router.post('/capture-order/:orderID', authMiddleware, captureOrder);

export default router;