import { useState, useEffect, useContext } from 'react';
import { SystemContext } from '../App';

export default function AlertsManager() {
  const { authFetch } = useContext(SystemContext);
  const [alerts, setAlerts] = useState([]);
  const [metric, setMetric] = useState('log_count');
  const [threshold, setThreshold] = useState(100);
  const [condition, setCondition] = useState('above');

  const fetchAlerts = async () => {
    const response = await authFetch('/api/alerts');
    const data = await response.json();
    setAlerts(data);
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const createAlert = async (e) => {
    e.preventDefault();
    await authFetch('/api/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metric, threshold, condition }),
    });
    fetchAlerts();
  };

  const deleteAlert = async (id) => {
    await authFetch(`/api/alerts/${id}`, { method: 'DELETE' });
    fetchAlerts();
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #374151', borderRadius: '8px', marginTop: '20px' }}>
      <h2>System Alerts</h2>
      <form onSubmit={createAlert} style={{ marginBottom: '20px' }}>
        <select value={metric} onChange={e => setMetric(e.target.value)} style={{ marginRight: '10px' }}>
          <option value="log_count">Log Count</option>
        </select>
        <select value={condition} onChange={e => setCondition(e.target.value)} style={{ marginRight: '10px' }}>
          <option value="above">Above</option>
          <option value="below">Below</option>
        </select>
        <input type="number" value={threshold} onChange={e => setThreshold(e.target.value)} style={{ marginRight: '10px' }} />
        <button type="submit">Create Alert</button>
      </form>
      <ul>
        {alerts.map(alert => (
          <li key={alert._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span>{`Metric: ${alert.metric}, Condition: ${alert.condition}, Threshold: ${alert.threshold}`}</span>
            <button onClick={() => deleteAlert(alert._id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}