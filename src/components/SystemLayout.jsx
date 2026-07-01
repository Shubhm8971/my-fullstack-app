import { useContext } from 'react';
import { SystemContext } from '../App';
import Navbar from './Navbar';
import Dashboard from './Dashboard';
import AlertsManager from './AlertsManager';
import Notifications from './Notifications';

export default function SystemLayout() {
  const { theme, logout } = useContext(SystemContext);
  return (
    <div style={{ backgroundColor: theme === 'DARK' ? '#030712' : '#f3f4f6', color: theme === 'DARK' ? '#ffffff' : '#111827', minHeight: '100vh', padding: '20px' }}>
      <Navbar />
      <div style={{ textAlign: 'right', marginTop: '10px' }}>
        <button onClick={logout}>LOGOUT</button>
      </div>
      <Dashboard />
      <AlertsManager />
      <Notifications />
    </div>
  );
}