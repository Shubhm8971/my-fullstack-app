import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || '';
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
app.get('/api/system-status', (req, res) => {
  res.json({
    status: "ONLINE",
    message: "Backend pipeline active",
    timestamp: new Date().toISOString()
  });
});

app.get('/api/system-logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.post('/api/system-logs', async (req, res) => {
  try {
    const newLog = new Log(req.body);
    await newLog.save();
    console.log("💾 Log persisted to MongoDB:", req.body);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save log" });
  }
});

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ status: 'ALIVE', timestamp: new Date().toISOString() })}\n\n`);
  }, 30000);

  req.on('close', () => clearInterval(interval));
});

// 4. Serve static files and fallback
app.use(express.static(path.join(__dirname, 'dist')));

// Regex fallback for SPA routing
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));