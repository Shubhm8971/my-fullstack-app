import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthView from './AuthView.jsx';

const root = createRoot(document.getElementById('root'));

// The gatekeeper: Check localStorage before calling root.render
const token = localStorage.getItem('token');

// If token exists, render App; otherwise, render AuthView.
// This prevents React from rendering a default null state.
root.render(
  <StrictMode>
    {token ? <App /> : <AuthView />}
  </StrictMode>
);