import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthView from './AuthView.jsx';
import { useAuth } from './useAuth.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

const Main = () => {
  const { token } = useAuth();
  return token ? <App /> : <AuthView />;
};

root.render(<Main />);