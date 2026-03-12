import React from 'react';
import './Header.css';

const Header = ({ username }) => {
  return (
    <header className="header">
      <h1>Bienvenido, {username}!</h1>
      <p>Explora los próximos eventos en Bit-Ticket</p>
    </header>
  );
};

export default Header;