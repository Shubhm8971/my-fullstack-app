import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

const initialToken = localStorage.getItem('token');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App initialToken={initialToken} />
  </StrictMode>,
);