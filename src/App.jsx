import { useState, createContext, useEffect } from 'react';
import { useAuth } from './useAuth';
import SystemLayout from './components/SystemLayout';

export const SystemContext = createContext();

export default function App() {
  const { token, logout, authFetch } = useAuth();
  const [theme, setTheme] = useState('DARK');
  const [serverStatus, setServerStatus] = useState({ status: 'LOADING', message: '...' });

  const checkServer = async () => {
    try {
      const response = await authFetch('/api/system-status', { cache: 'no-store' });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      setServerStatus(data);
    } catch (_err) {
      setServerStatus({ status: 'OFFLINE', message: _err.message });
    }
  };

  useEffect(() => {
    if (token) {
      checkServer();
      const interval = setInterval(checkServer, 10000);
      return () => clearInterval(interval);
    }
  }, [token]);

  return (
    <SystemContext.Provider value={{ theme, setTheme, serverStatus, checkServer, authFetch, logout }}>
      <SystemLayout />
    </SystemContext.Provider>
  );
}