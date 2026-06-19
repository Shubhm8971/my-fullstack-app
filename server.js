import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose'; // Add this
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'YOUR_MONGODB_CONNECTION_STRING_HERE';
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 2. Define Schema
const LogSchema = new mongoose.Schema({
  timestamp: String,
  event: String,
  origin: String
});
const Log = mongoose.model('Log', LogSchema);

app.use(cors());
app.use(express.json());

// 3. API Routes
app.get('/api/system-logs', async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
  res.json(logs);
});

app.post('/api/system-logs', async (req, res) => {
  const newLog = new Log(req.body);
  await newLog.save();
  res.status(201).json({ success: true });
});

// Serve static files and fallback
app.use(express.static(path.join(__dirname, 'dist')));
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));