import React, { useState } from 'react';
import './Hero.css';

const Hero = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputValue);
      // Hacer scroll suave hacia la sección de eventos
      document.getElementById('eventos')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="inicio">
      <div className="hero-background">
        <img 
          src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Event background" 
        />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-content">
        <div className="badge glass-panel">🔥 Los mejores eventos de la ciudad</div>
        <h1 className="hero-title">
          Vive la experiencia, <br />
          <span className="text-gradient">siente la emoción.</span>
        </h1>
        <p className="hero-subtitle">
          Descubre y asegura tus lugares para los eventos más esperados. 
          Deportes, teatro, conferencias y conciertos en un solo lugar.
        </p>
        
        <form className="hero-search glass-panel" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Buscar artista, evento o recinto..." 
            className="search-input" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="btn-primary">Buscar Boletos</button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
