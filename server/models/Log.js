import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  event: { type: String, required: true },
  origin: { type: String, required: true },
});

const Log = mongoose.model('Log', LogSchema);

export default Log;
