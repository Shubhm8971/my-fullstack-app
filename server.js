import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = './database.json';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// 1. Database Initialization
const initDb = async () => {
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify([]));
  }
};
initDb();

// 2. API Routes
app.get('/api/system-status', (req, res) => {
  res.json({
    status: "ONLINE",
    message: "Backend pipeline active",
    timestamp: new Date().toISOString()
  });
});

app.get('/api/system-logs', async (req, res) => {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.post('/api/system-logs', async (req, res) => {
  try {
    const newLog = req.body;
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const logs = JSON.parse(data);
    logs.push(newLog);
    await fs.writeFile(DB_FILE, JSON.stringify(logs, null, 2));
    
    console.log("💾 Log persisted to disk:", newLog);
    res.status(201).json({ success: true, message: "Log saved to disk!" });
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

// 3. PRODUCTION: Serve Static Files
// This serves your react build from the /dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// 4. PRODUCTION: SPA Fallback
// This ensures that React Router handles all client-side navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Server Initialization
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});