import express from 'express';
import { createOrder, captureOrder } from '../controllers/paymentController.js';

const router = express.Router();

// CREATE ORDER
router.post('/create-order', createOrder);

// CAPTURE ORDER
router.post('/capture-order/:orderID', captureOrder);

export default router;