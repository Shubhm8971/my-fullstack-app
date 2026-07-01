import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f0f2f5' }}>
        <div style={{
          width: '250px',
          backgroundColor: '#001529',
          color: 'white',
          padding: '20px'
        }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Monitoring</h1>
          <nav>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '15px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>Dashboard</Link>
              </li>
            </ul>
          </nav>
        </div>
        <main style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
