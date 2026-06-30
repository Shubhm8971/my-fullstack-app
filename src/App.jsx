import { useState, createContext, useContext, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from './useAuth.jsx';

const SystemContext = createContext();

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

function SystemLayout() {
  const { theme, logout } = useContext(SystemContext);
  return (
    <div style={{ backgroundColor: theme === 'DARK' ? '#030712' : '#f3f4f6', color: theme === 'DARK' ? '#ffffff' : '#111827', minHeight: '100vh', padding: '20px' }}>
      <Navbar />
      <div style={{ textAlign: 'right', marginTop: '10px' }}>
        <button onClick={logout}>LOGOUT</button>
      </div>
      <Dashboard />
    </div>
  );
}

function Navbar() {
  const { theme, setTheme, serverStatus, checkServer } = useContext(SystemContext);
  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #374151', display: 'flex', justifyContent: 'space-between' }}>
      <strong>SYSTEM_CORE_V3.0</strong>
      <div>
        <span style={{ color: serverStatus.status === 'ONLINE' ? '#10b981' : '#ef4444', marginRight: '15px' }}>SERVER: {serverStatus.status}</span>
        <button onClick={checkServer} style={{ marginRight: '5px' }}>REFRESH</button>
        <button onClick={() => setTheme(theme === 'DARK' ? 'LIGHT' : 'DARK')}>THEME: {theme}</button>
      </div>
    </nav>
  );
}

function Dashboard() {
  const { authFetch } = useContext(SystemContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = '/api/system-logs?';
      if (startDate) url += `startDate=${startDate}&`;
      if (endDate) url += `endDate=${endDate}`;

      const response = await authFetch(url);
      const data = await response.json();
      setLogs(data);
    } catch (_err) { console.error("Failed to load logs"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, []);

  const getChartData = () => {
    const counts = logs.reduce((acc, log) => {
      acc[log.event] = (acc[log.event] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(event => ({ name: event, count: counts[event] }));
  };

  const exportToCSV = () => {
    const headers = ["Timestamp,Event"];
    const csvRows = logs.map(log => `${log.timestamp},${log.event}`);
    const csvContent = [headers, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `logs_export_${new Date().toISOString().slice(0, 10)}.csv`);
    a.click();
  };

  const clearAllLogs = async () => {
    if (!confirm("WARNING: This will delete ALL system logs. Are you sure?")) return;
    try {
      const response = await authFetch('/api/system-logs', { method: 'DELETE' });
      if (response.ok) {
        alert("Logs cleared successfully");
        fetchLogs();
      } else {
        alert("Access Denied: Admins only");
      }
    } catch (_err) { console.error("Failed to clear logs"); }
  };

  const sendSystemPing = async () => {
    await authFetch('/api/system-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: new Date().toISOString(), event: "Manual Health Check" })
    });
    fetchLogs();
  };

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <style>{`
        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.1);
          border-left: 4px solid #6366f1;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
      <h1>SECURED MONITORING</h1>
      
      <div style={{ height: '300px', width: '100%', maxWidth: '600px', margin: '20px auto' }}>
        <ResponsiveContainer>
          <BarChart data={getChartData()}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Bar dataKey="count" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input type="date" onChange={e => setStartDate(e.target.value)} />
        <input type="date" onChange={e => setEndDate(e.target.value)} style={{ margin: '0 10px' }} />
        <button onClick={fetchLogs}>Filter Logs</button>
        <button onClick={exportToCSV} style={{ marginLeft: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Export CSV</button>
        <button onClick={clearAllLogs} style={{ marginLeft: '10px', backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>PURGE ALL LOGS</button>
      </div>

      <button onClick={sendSystemPing} style={{ padding: '10px 20px', cursor: 'pointer' }}>PING SERVER</button>
      
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
          {logs.map((log, i) => <li key={i}>{log.timestamp?.slice(0, 10)} - {log.event}</li>)}
        </ul>
      )}
    </div>
  );
}