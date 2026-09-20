import { calculateLegacyFactors } from '../services/calculationService.js';
import CalculationHistory from '../models/CalculationHistory.js';
import { LIFE_FACTORS } from '../utils/factorConstants.js';
import { getDbStatus } from '../config/db.js';

// In-memory history cache if Mongo is offline
const inMemoryHistory = [];

export const calculate = async (req, res, next) => {
  try {
    const { dob, dynamicSeed, customFactors } = req.body;

    if (!dob) {
      return res.status(400).json({
        success: false,
        message: 'Date of Birth (dob) is required in DD/MM/YYYY or YYYY-MM-DD format.'
      });
    }

    const result = calculateLegacyFactors(dob, { 
      dynamicSeed: !!dynamicSeed,
      customFactors: Array.isArray(customFactors) && customFactors.length > 0 ? customFactors : null
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const saveCalculation = async (req, res, next) => {
  try {
    const calculationData = req.body;

    if (!calculationData || !calculationData.dob || !calculationData.factors) {
      return res.status(400).json({
        success: false,
        message: 'Invalid calculation payload to save.'
      });
    }

    const userId = req.user ? req.user._id : null;

    if (getDbStatus()) {
      const record = await CalculationHistory.create({
        ...calculationData,
        userId
      });

      return res.status(201).json({
        success: true,
        message: 'Calculation saved to database successfully',
        data: { id: record._id }
      });
    } else {
      // In-memory fallback
      const fakeId = 'rec_' + Date.now();
      const record = {
        _id: fakeId,
        ...calculationData,
        userId,
        createdAt: new Date()
      };
      inMemoryHistory.unshift(record);

      return res.status(201).json({
        success: true,
        message: 'Calculation saved successfully (in-memory mode)',
        data: { id: fakeId }
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;

    if (getDbStatus()) {
      const query = userId ? { userId } : {};
      const history = await CalculationHistory.find(query)
        .sort({ createdAt: -1 })
        .limit(50);

      return res.status(200).json({
        success: true,
        count: history.length,
        data: history
      });
    } else {
      // In-memory fallback
      const filtered = userId 
        ? inMemoryHistory.filter(h => String(h.userId) === String(userId))
        : inMemoryHistory;

      return res.status(200).json({
        success: true,
        count: filtered.length,
        data: filtered
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getBaseline = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: {
        factors: LIFE_FACTORS,
        invariant: 100.000
      }
    });
  } catch (error) {
    next(error);
  }
};
