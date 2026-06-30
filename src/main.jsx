import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthView from './AuthView.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
const token = localStorage.getItem('token');

// Render immediately, no StrictMode to avoid double-rendering cycles
root.render(token ? <App /> : <AuthView />);