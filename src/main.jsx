import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthView from './AuthView.jsx'; // We'll move AuthView to its own file

const token = localStorage.getItem('token');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {token ? <App /> : <AuthView />}
  </StrictMode>,
);