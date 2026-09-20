import express from 'express';
import { calculate, saveCalculation, getHistory, getBaseline } from '../controllers/calculatorController.js';
import { optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/calculate', calculate);
router.get('/baseline', getBaseline);
router.post('/save', optionalAuth, saveCalculation);
router.get('/history', optionalAuth, getHistory);

export default router;
