import mongoose from 'mongoose';

const factorItemSchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
  motherValue: { type: Number, required: true },
  fatherValue: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  min: Number,
  max: Number
}, { _id: false });

const calculationHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  dob: {
    type: String,
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  isOddDay: {
    type: Boolean,
    required: true
  },
  dominantParent: {
    type: String,
    enum: ['Mother', 'Father'],
    required: true
  },
  differencePercentage: {
    type: Number,
    required: true
  },
  motherTotal: {
    type: Number,
    required: true
  },
  fatherTotal: {
    type: Number,
    required: true
  },
  grandTotal: {
    type: Number,
    required: true,
    default: 100
  },
  factors: [factorItemSchema],
  note: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const CalculationHistory = mongoose.model('CalculationHistory', calculationHistorySchema);
export default CalculationHistory;
