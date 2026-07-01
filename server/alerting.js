import Alert from './models/Alert.js';
import Log from './models/Log.js';
import { send } from './sse.js';

const checkAlerts = async () => {
  const alerts = await Alert.find();

  for (const alert of alerts) {
    let currentValue;
    if (alert.metric === 'log_count') {
      currentValue = await Log.countDocuments();
    }

    let triggered = false;
    if (alert.condition === 'above' && currentValue > alert.threshold) {
      triggered = true;
    }
    if (alert.condition === 'below' && currentValue < alert.threshold) {
      triggered = true;
    }

    if (triggered && !alert.triggered) {
      send({ type: 'alert', message: `Alert: ${alert.metric} is ${alert.condition} ${alert.threshold}` });
      alert.triggered = true;
      await alert.save();
    } else if (!triggered && alert.triggered) {
      alert.triggered = false;
      await alert.save();
    }
  }
};

export const startAlerting = () => {
  setInterval(checkAlerts, 10000); // Check every 10 seconds
};
