import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <span className="text-gradient">Bit</span>Ticket
        </div>
        <ul className="nav-links">
          <li><a href="#inicio" className="active">Inicio</a></li>
          <li><a href="#eventos">Eventos</a></li>
          <li><a href="#nosotros">Nosotros</a></li>
        </ul>
        <div className="nav-actions">
          <button className="btn-secondary">Iniciar Sesión</button>
          <button className="btn-primary">Registrarse</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;