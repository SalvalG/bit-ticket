import React from 'react';
import './Events.css';

const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Neon Nights Festival',
    artist: 'Varios Artistas',
    date: '15 Oct 2026',
    location: 'Estadio Olímpico',
    price: '$120.00',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Festival'
  },
  {
    id: 2,
    title: 'Final del Campeonato',
    artist: 'Equipos Locales',
    date: '22 Nov 2026',
    location: 'Arena Principal',
    price: '$85.00',
    image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Deportes'
  },
  {
    id: 3,
    title: 'El Fantasma de la Ópera',
    artist: 'Compañía Teatral Nacional',
    date: '05 Dic 2026',
    location: 'Teatro Metropólitan',
    price: '$60.00',
    image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Teatro'
  }
];

const Events = () => {
  return (
    <section className="events-section" id="eventos">
      <div className="events-container">
        <div className="events-header">
          <h2>Eventos <span className="text-gradient">Destacados</span></h2>
          <button className="btn-secondary">Ver todos</button>
        </div>
        
        <div className="events-grid">
          {MOCK_EVENTS.map(event => (
            <div key={event.id} className="event-card glass-panel">
              <div className="event-image-wrapper">
                <img src={event.image} alt={event.title} className="event-image" />
                <span className="event-tag">{event.tag}</span>
              </div>
              <div className="event-info">
                <div className="event-date">{event.date}</div>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-details">
                  <span>👤 {event.artist}</span>
                  <span>📍 {event.location}</span>
                </div>
                <div className="event-footer">
                  <span className="event-price">{event.price}</span>
                  <button className="btn-primary small-btn">Comprar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;