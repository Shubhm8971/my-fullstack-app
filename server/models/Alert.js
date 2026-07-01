import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Alert = mongoose.model('Alert', AlertSchema);

export default Alert;
