import { useState, createContext, useContext, useEffect } from 'react';

// 1. GLOBAL CONTEXT
const SystemContext = createContext();

// CONFIGURATION: Remove the full URL. Use relative paths for the proxy to work.
const API_BASE = ''; 

export default function App() {
  const [theme, setTheme] = useState('DARK');
  const [serverStatus, setServerStatus] = useState({ status: 'LOADING', message: '...' });

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/system-status`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        setServerStatus(data);
      } catch (err) {
        setServerStatus({ status: 'OFFLINE', message: 'Proxy unreachable' });
      }
    };
    checkServer();
  }, []);

  return (
    <SystemContext.Provider value={{ theme, setTheme, serverStatus }}>
      <SystemLayout />
    </SystemContext.Provider>
  );
}

function SystemLayout() {
  const { theme } = useContext(SystemContext);
  return (
    <div style={{ 
      backgroundColor: theme === 'DARK' ? '#030712' : '#f3f4f6', 
      color: theme === 'DARK' ? '#ffffff' : '#111827',
      height: '100vh', transition: 'all 0.3s ease', padding: '20px'
    }}>
      <Navbar />
      <Dashboard />
    </div>
  );
}

function Navbar() {
  const { theme, setTheme, serverStatus } = useContext(SystemContext);
  
  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between' }}>
      <strong>SYSTEM_CORE_V3.0</strong>
      <div>
        <span style={{ marginRight: '20px', color: serverStatus.status === 'ONLINE' ? '#10b981' : '#ef4444' }}>
          SERVER: {serverStatus.status}
        </span>
        <button onClick={() => setTheme(theme === 'DARK' ? 'LIGHT' : 'DARK')}>
          THEME: {theme}
        </button>
      </div>
    </nav>
  );
}

function Dashboard() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/system-logs`);
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to load logs");
    }
  };

  useEffect(() => {
    // 1. Establish Real-time connection via relative path
    const eventSource = new EventSource(`${API_BASE}/api/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📡 Real-time heartbeat:", data);
      fetchLogs();
    };

    // 2. Initial fetch
    fetchLogs();

    return () => eventSource.close();
  }, []);

  const sendSystemPing = async () => {
    try {
      await fetch(`${API_BASE}/api/system-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          timestamp: new Date().toISOString(), 
          event: "Manual Health Check",
          origin: "React Dashboard" 
        })
      });
    } catch (err) {
      alert("Failed to send log.");
    }
  };
  
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>REAL-TIME STREAMING</h1>
      
      <button 
        onClick={sendSystemPing} 
        style={{ padding: '10px 20px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        PING SERVER
      </button>

      <div style={{ marginTop: '30px', textAlign: 'left', maxWidth: '500px', margin: '30px auto' }}>
        <h3>Stored Logs:</h3>
        <ul style={{ padding: '10px', backgroundColor: '#1f2937', borderRadius: '8px' }}>
          {logs.map((log, i) => (
            <li key={i} style={{ fontSize: '0.8rem', marginBottom: '5px' }}>
              {log.timestamp.slice(11, 19)} | {log.event}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}