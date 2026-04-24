import React, { useState, useEffect } from 'react';
import './Events.css';
import EventModal from './EventModal';
import CheckoutModal from './CheckoutModal';

const MOCK_EVENTS_FALLBACK = [
  {
    id: 'mock-1',
    nombre: 'Neon Nights Festival',
    ubicacion: 'Estadio Olímpico',
    fecha: '2026-10-15T20:00:00.000Z',
    imagen_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    zonas: [{ id: 'z1', nombre: 'General', precio: 120 }]
  }
];

const Events = ({ user, token, onRequireLogin, searchQuery }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [purchasingEvent, setPurchasingEvent] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:3001/api/events';
      if (searchQuery) {
        url += `?nombre=${encodeURIComponent(searchQuery)}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error('Error al obtener los eventos del servidor');
      const data = await res.json();
      setEvents(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar al servidor. Mostrando datos de prueba.');
      setEvents(MOCK_EVENTS_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [searchQuery]);

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <section className="events-section" id="eventos">
      <div className="events-container">
        <div className="events-header">
          <h2>Eventos <span className="text-gradient">Disponibles</span></h2>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-secondary" onClick={fetchEvents}>Actualizar 🔄</button>
            {user && user.rol === 'ADMIN' && (
              <button className="btn-primary" onClick={() => setIsEventModalOpen(true)}>+ Nuevo Evento</button>
            )}
          </div>
        </div>
        
        {error && <div style={{ color: '#ff4a4a', marginBottom: '20px', background: 'rgba(255,74,74,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Cargando eventos...</div>
        ) : (
          <div className="events-grid">
            {events.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No hay eventos disponibles aún.</div>
            ) : (
              events.map(event => (
                <div key={event.id} className="event-card glass-panel">
                  <div className="event-image-wrapper">
                    <img 
                      src={event.imagen_url || 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                      alt={event.nombre} 
                      className="event-image" 
                    />
                    <span className="event-tag">Evento</span>
                  </div>
                  <div className="event-info">
                    <div className="event-date">{formatDate(event.fecha)}</div>
                    <h3 className="event-title">{event.nombre}</h3>
                    <div className="event-details">
                      {event.descripcion && <span style={{fontSize: '0.8rem', marginBottom: '8px'}}>{event.descripcion}</span>}
                      <span>📍 {event.ubicacion}</span>
                    </div>
                    <div className="event-footer">
                      <span className="event-price">
                        ${event.zonas && event.zonas.length > 0 ? event.zonas[0].precio : 'N/A'}
                      </span>
                      <button className="btn-primary small-btn" onClick={() => setPurchasingEvent(event)}>
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <EventModal 
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        token={token}
        onEventAdded={fetchEvents}
      />

      <CheckoutModal
        isOpen={!!purchasingEvent}
        onClose={() => setPurchasingEvent(null)}
        event={purchasingEvent}
        token={token}
        user={user}
        onRequireLogin={() => {
          setPurchasingEvent(null);
          onRequireLogin();
        }}
        onPurchaseSuccess={(boleto) => {
          // Aquí podríamos descargar automáticamente o actualizar UI
          console.log("Boleto comprado:", boleto);
        }}
      />
    </section>
  );
};

export default Events;