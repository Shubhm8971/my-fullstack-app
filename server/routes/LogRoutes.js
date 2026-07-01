import express from 'express';
import Log from '../models/Log.js';
import { send } from '../sse.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { startDate, endDate } = req.query;
  let query = {};

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }

  const logs = await Log.find(query).sort({ timestamp: -1 }).limit(50);
  res.json(logs);
});

router.post('/', async (req, res) => {
  const { event, origin } = req.body;
  const newLog = new Log({ timestamp: new Date().toISOString(), event, origin });
  await newLog.save();
  send({ type: 'new_log', data: newLog });
  res.status(201).json(newLog);
});

router.delete('/', async (req, res) => {
  await Log.deleteMany({});
  send({ type: 'logs_cleared' });
  res.status(204).send();
});

router.get('/count', async (req, res) => {
  const count = await Log.countDocuments();
  res.json({ count });
});

export default router;
