import React from 'react';
import './Header.css';

const Header = ({ logo }) => {
  return (
    <header className="header">
      {logo && <img src={logo} className="header-logo" alt="logo" />}
      <h1>My Awesome App</h1>
    </header>
  );
};

export default Header;
