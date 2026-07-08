import React from 'react';
import './Button.css';

const Button = ({ children, onClick, className = '', icon, ...props }) => {
  return (
    <button className={`button ${className}`} onClick={onClick} {...props}>
      {icon && (
        <svg className="button-icon" viewBox="0 0 24 24">
          <use href={`/icons.svg#${icon}`} />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
