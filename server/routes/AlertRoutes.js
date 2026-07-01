import express from 'express';
import Alert from '../models/Alert.js';

const router = express.Router();

// Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Create an alert
router.post('/', async (req, res) => {
  const { message } = req.body;
  try {
    const alert = new Alert({ message });
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).send('Error creating alert');
  }
});

export default router;
