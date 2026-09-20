import mongoose from 'mongoose';

let isDbConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/parental_legacy_db';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isDbConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    isDbConnected = false;
    console.warn(`[MongoDB] Warning: Local MongoDB connection unavailable (${error.message}). Running with in-memory persistence fallback.`);
  }
};

export const getDbStatus = () => isDbConnected;
