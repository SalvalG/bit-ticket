import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = ({ user, onLoginClick, onLogout, onMyEventsClick }) => {
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
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: '500'}}>
                Hola, {user.nombre}
                {user.rol === 'ADMIN' && <span style={{marginLeft: '8px', fontSize: '0.7rem', padding: '2px 6px', background: 'var(--primary)', borderRadius: '10px', color: '#000', fontWeight: 'bold'}}>ADMIN</span>}
              </span>
              <button className="btn-primary" onClick={onMyEventsClick} style={{padding: '8px 16px', fontSize: '0.9rem'}}>Mis Eventos</button>
              <button className="btn-secondary" onClick={onLogout} style={{padding: '8px 16px', fontSize: '0.9rem'}}>Salir</button>
            </div>
          ) : (
            <button className="btn-primary" onClick={onLoginClick}>Iniciar Sesión</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;