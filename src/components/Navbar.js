import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>Inicio</li>
        <li>Eventos</li>
        <li>Mi Perfil</li>
        <li>Contacto</li>
      </ul>
    </nav>
  );
};

export default Navbar;