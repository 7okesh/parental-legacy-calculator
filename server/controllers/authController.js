import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDbStatus } from '../config/db.js';

// In-memory fallback users if Mongo is offline
const inMemoryUsers = new Map();

const generateToken = (id, email, name) => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_quantum_vedic_2026_production';
  return jwt.sign({ id, email, name }, secret, { expiresIn: '30d' });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields (name, email, password).' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getDbStatus()) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User already exists with this email address.' });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password
      });

      const token = generateToken(user._id, user.email, user.name);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } else {
      // In-memory fallback
      if (inMemoryUsers.has(normalizedEmail)) {
        return res.status(400).json({ success: false, message: 'User already exists with this email address.' });
      }

      const fakeId = 'usr_' + Date.now();
      const userData = { id: fakeId, name, email: normalizedEmail, password, role: 'user' };
      inMemoryUsers.set(normalizedEmail, userData);

      const token = generateToken(fakeId, normalizedEmail, name);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully (in-memory mode)',
        data: {
          token,
          user: {
            id: fakeId,
            name,
            email: normalizedEmail,
            role: 'user'
          }
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (getDbStatus()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id, user.email, user.name);
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          }
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    } else {
      // In-memory fallback
      const user = inMemoryUsers.get(normalizedEmail);
      if (user && user.password === password) {
        const token = generateToken(user.id, user.email, user.name);
        return res.status(200).json({
          success: true,
          message: 'Login successful (in-memory mode)',
          data: {
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role
            }
          }
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    next(error);
  }
};
