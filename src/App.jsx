import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="container">
      <header className="header">
        <nav className="nav">
          <a href="#" className="nav-logo">MyApp</a>
          <ul className="nav-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main className="main">
        <section className="hero">
          <h1 className="hero-title">Welcome to Your Awesome App</h1>
          <p className="hero-subtitle">A starting point for something amazing.</p>
          <button className="btn btn-primary">Get Started</button>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2024 MyApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
