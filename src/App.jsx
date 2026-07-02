import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="container">
        <header className="header">
          <nav className="nav">
            <Link to="/" className="nav-logo">MyApp</Link>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </nav>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2024 MyApp. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

const HeroSection = () => (
  <section className="hero">
    <h1 className="hero-title">Welcome to Your Awesome App</h1>
    <p className="hero-subtitle">A starting point for something amazing.</p>
    <button className="btn btn-primary">Get Started</button>
  </section>
);

export default App;
