import express from 'express';
import Alert from '../models/Alert.js';

const router = express.Router();

// Get all alerts
router.get('/', async (req, res) => {
  const alerts = await Alert.find();
  res.json(alerts);
});

// Create a new alert
router.post('/', async (req, res) => {
  const { metric, threshold, condition } = req.body;
  const newAlert = new Alert({ metric, threshold, condition });
  await newAlert.save();
  res.status(201).json(newAlert);
});

// Delete an alert
router.delete('/:id', async (req, res) => {
  await Alert.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;
