import { useState, createContext, useContext, useEffect } from 'react';

// 1. GLOBAL CONTEXT
const SystemContext = createContext();

// Use an empty string for relative paths (works perfectly on Render)
const API_BASE = ''; 

export default function App() {
  const [theme, setTheme] = useState('DARK');
  const [serverStatus, setServerStatus] = useState({ status: 'LOADING', message: '...' });

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

  useEffect(() => {
    checkServer();
    // Re-check every 10 seconds to recover from temporary downtime
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SystemContext.Provider value={{ theme, setTheme, serverStatus, checkServer }}>
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
      minHeight: '100vh', transition: 'all 0.3s ease', padding: '20px'
    }}>
      <Navbar />
      <Dashboard />
    </div>
  );
}

function Navbar() {
  const { theme, setTheme, serverStatus, checkServer } = useContext(SystemContext);
  
  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <strong>SYSTEM_CORE_V3.0</strong>
      <div>
        <span style={{ marginRight: '20px', color: serverStatus.status === 'ONLINE' ? '#10b981' : '#ef4444' }}>
          SERVER: {serverStatus.status}
        </span>
        {serverStatus.status === 'OFFLINE' && (
          <button onClick={checkServer} style={{ marginRight: '10px' }}>RETRY</button>
        )}
        <button onClick={() => setTheme(theme === 'DARK' ? 'LIGHT' : 'DARK')}>
          THEME: {theme}
        </button>
      </div>
    </nav>
  );
}

function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/system-logs`);
      if (!response.ok) return;
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      console.error("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const eventSource = new EventSource(`${API_BASE}/api/events`);
    eventSource.onmessage = (event) => {
      setLastSync(new Date().toLocaleTimeString());
      fetchLogs();
    };
    fetchLogs();
    return () => eventSource.close();
  }, []);

  const sendSystemPing = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/system-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          timestamp: new Date().toISOString(), 
          event: "Manual Health Check",
          origin: "React Dashboard" 
        })
      });
      if (res.ok) fetchLogs(); // Immediate refresh after ping
    } catch (err) {
      alert("Failed to send log.");
    }
  };
  
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>REAL-TIME MONITORING</h1>
      <div style={{ marginBottom: '15px', fontSize: '0.8rem', color: '#9ca3af' }}>
        {lastSync ? `Last Sync: ${lastSync}` : "Waiting for heartbeat..."}
      </div>
      <button 
        onClick={sendSystemPing} 
        style={{ padding: '10px 20px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        PING SERVER
      </button>

      <div style={{ marginTop: '30px', textAlign: 'left', maxWidth: '500px', margin: '30px auto' }}>
        <h3>Stored Logs:</h3>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading logs from MongoDB...</p>
        ) : logs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280' }}>No logs found.</p>
        ) : (
          <ul style={{ padding: '15px', backgroundColor: '#1f2937', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {logs.map((log, i) => (
              <li key={i} style={{ fontSize: '0.85rem', marginBottom: '8px', borderBottom: '1px solid #374151' }}>
                <span style={{ color: '#818cf8', marginRight: '10px' }}>{log.timestamp ? log.timestamp.slice(11, 19) : 'N/A'}</span> 
                {log.event}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}