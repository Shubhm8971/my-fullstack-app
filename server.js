import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './User.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// 1. Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || '';
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 2. Schemas
const LogSchema = new mongoose.Schema({ timestamp: String, event: String, origin: String });
const Log = mongoose.model('Log', LogSchema);

// 3. Auth Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: "Access Denied" });
  
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: "Access Denied: Admins only" });
  }
  next();
};

app.use(cors());
app.use(express.json());

// 4. Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed" });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid username or password" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// 5. Protected Routes
app.get('/api/system-logs', authenticate, async (req, res) => {
  const { startDate, endDate } = req.query;
  let query = {};

  // Build query if dates are provided
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }

  const logs = await Log.find(query).sort({ timestamp: -1 }).limit(50);
  res.json(logs);
});

app.delete('/api/system-logs', authenticate, authorizeAdmin, async (req, res) => {
  try {
    await Log.deleteMany({});
    res.json({ message: "All logs cleared by Admin" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear logs" });
  }
});

// Unprotected
app.get('/api/system-status', (req, res) => {
  res.json({ status: "ONLINE", timestamp: new Date().toISOString() });
});

// 6. Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));