import { useState, createContext, useContext, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SystemContext = createContext();
const API_BASE = ''; 

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [theme, setTheme] = useState('DARK');
  const [serverStatus, setServerStatus] = useState({ status: 'LOADING', message: '...' });

  const checkServer = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/system-status`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = await response.json();
      setServerStatus(data);
    } catch (err) {
      setServerStatus({ status: 'OFFLINE', message: err.message });
    }
  };

  useEffect(() => {
    checkServer();
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!token) return <AuthView onLogin={(t) => { localStorage.setItem('token', t); setToken(t); }} />;

  return (
    <SystemContext.Provider value={{ theme, setTheme, serverStatus, checkServer, token, setToken }}>
      <SystemLayout />
    </SystemContext.Provider>
  );
}

function AuthView({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    
    if (isRegister) {
      alert(data.message || data.error);
      if (!data.error) setIsRegister(false);
    } else if (data.token) {
      try {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        console.log("Logged in user role:", payload.role);
      } catch (err) { console.error("Could not decode token"); }
      onLogin(data.token);
    } else {
      alert(data.error || 'Login failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h2>{isRegister ? 'REGISTER SYSTEM' : 'SYSTEM LOGIN'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input name="username" id="username" placeholder="Username" onChange={e => setUsername(e.target.value)} style={{ padding: '8px' }} />
        <input type="password" name="password" id="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ padding: '8px' }} />
        <button type="submit">{isRegister ? 'REGISTER' : 'LOGIN'}</button>
        <button type="button" onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }}>
          {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </form>
    </div>
  );
}

function SystemLayout() {
  const { theme, setToken } = useContext(SystemContext);
  return (
    <div style={{ backgroundColor: theme === 'DARK' ? '#030712' : '#f3f4f6', color: theme === 'DARK' ? '#ffffff' : '#111827', minHeight: '100vh', padding: '20px' }}>
      <Navbar />
      <div style={{ textAlign: 'right', marginTop: '10px' }}>
        <button onClick={() => { localStorage.removeItem('token'); setToken(null); window.location.reload(); }}>LOGOUT</button>
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
  const { token } = useContext(SystemContext);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/system-logs?`;
      if (startDate) url += `startDate=${startDate}&`;
      if (endDate) url += `endDate=${endDate}`;

      const response = await fetch(url, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      const data = await response.json();
      setLogs(data);
    } catch (err) { console.error("Failed to load logs"); } finally { setLoading(false); }
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
      const response = await fetch(`${API_BASE}/api/system-logs`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("Logs cleared successfully");
        fetchLogs();
      } else {
        alert("Access Denied: Admins only");
      }
    } catch (err) { console.error("Failed to clear logs"); }
  };

  const sendSystemPing = async () => {
    await fetch(`${API_BASE}/api/system-logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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