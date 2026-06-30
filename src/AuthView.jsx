import { useState } from 'react';

// You may need to import API_BASE if you defined it elsewhere, 
// otherwise, define it here as a constant.
const API_BASE = ''; 

export default function AuthView() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (token) => {
    localStorage.setItem('token', token);
    window.location.reload(); // Refresh to trigger the authenticated state in main.jsx
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    
    try {
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
        handleLogin(data.token);
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Network error, please try again.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      flexDirection: 'column',
      backgroundColor: '#030712',
      color: '#ffffff' 
    }}>
      <h2>{isRegister ? 'REGISTER SYSTEM' : 'SYSTEM LOGIN'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input 
          name="username" 
          placeholder="Username" 
          onChange={e => setUsername(e.target.value)} 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #374151' }} 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={e => setPassword(e.target.value)} 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #374151' }} 
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>
          {isRegister ? 'REGISTER' : 'LOGIN'}
        </button>
        <button 
          type="button" 
          onClick={() => setIsRegister(!isRegister)} 
          style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }}
        >
          {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </form>
    </div>
  );
}