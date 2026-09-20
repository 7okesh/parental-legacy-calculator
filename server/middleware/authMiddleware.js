import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { getDbStatus } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, access token missing.'
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_quantum_vedic_2026_production';
    const decoded = jwt.verify(token, secret);

    let user = null;

    // Only attempt database lookup if MongoDB is connected AND id is a valid Mongo ObjectId
    if (getDbStatus() && mongoose.Types.ObjectId.isValid(decoded.id)) {
      try {
        user = await User.findById(decoded.id).select('-password');
      } catch {
        user = null;
      }
    }

    // If DB is offline, user is in-memory, or query returned null, construct user from decoded token payload
    if (!user) {
      user = {
        _id: decoded.id,
        id: decoded.id,
        email: decoded.email,
        name: decoded.name || 'User',
        role: decoded.role || 'user'
      };
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token verification failed.'
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_quantum_vedic_2026_production';
      const decoded = jwt.verify(token, secret);

      let user = null;
      if (getDbStatus() && mongoose.Types.ObjectId.isValid(decoded.id)) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch {
          user = null;
        }
      }

      if (!user) {
        user = {
          _id: decoded.id,
          id: decoded.id,
          email: decoded.email,
          name: decoded.name || 'User',
          role: decoded.role || 'user'
        };
      }

      req.user = user;
    } catch {
      // ignore invalid token for optional endpoints
    }
  }
  next();
};
