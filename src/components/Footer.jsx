import React from 'react';
import './Footer.css';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Stellar App. All rights reserved.</p>
      <div className="social-media">
        <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
      </div>
    </footer>
  );
};

export default Footer;
