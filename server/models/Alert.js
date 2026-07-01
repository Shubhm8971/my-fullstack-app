import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  metric: {
    type: String,
    required: true,
  },
  threshold: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    enum: ['above', 'below'],
    required: true,
  },
  triggered: {
    type: Boolean,
    default: false,
  },
});

const Alert = mongoose.model('Alert', alertSchema);

export default Alert;
