import jwt from 'jsonwebtoken';
import User from '../models/User.js';

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
    
    // Attach user (without password)
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      // In-memory or fallback mode user
      req.user = { _id: decoded.id, email: decoded.email, name: decoded.name || 'User' };
    }
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
      req.user = await User.findById(decoded.id).select('-password') || { _id: decoded.id };
    } catch {
      // ignore invalid token for optional endpoints
    }
  }
  next();
};
