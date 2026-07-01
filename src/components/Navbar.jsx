import { useContext } from 'react';
import { SystemContext } from '../App';

export default function Navbar() {
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