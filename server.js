import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './server/routes/index.js';
import { subscribe } from './server/sse.js';
import { startAlerting } from './server/alerting.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || '';
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(_err => console.error("❌ MongoDB connection error:", _err));

app.use(cors());
app.use(express.json());

// 2. API Routes
app.use('/api', routes);

// 3. SSE Route
app.get('/api/events', subscribe);

// 4. Start Alerting
startAlerting();

// 5. Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
