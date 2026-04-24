import React, { useState, useEffect, useMemo } from 'react';
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

const Events = ({ user, token, onRequireLogin, searchQuery, onClearSearch }) => {
  // Todos los eventos cargados del backend
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [purchasingEvent, setPurchasingEvent] = useState(null);

  // Cargar TODOS los eventos (sin filtro en la URL)
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/events');
      if (!res.ok) throw new Error('Error al obtener los eventos del servidor');
      const data = await res.json();
      setAllEvents(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar al servidor. Mostrando datos de prueba.');
      setAllEvents(MOCK_EVENTS_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial
  useEffect(() => {
    fetchEvents();
  }, []);

  // Filtrado local en tiempo real (letra por letra)
  const events = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return allEvents;
    const q = searchQuery.toLowerCase().trim();
    return allEvents.filter(
      (ev) =>
        ev.nombre?.toLowerCase().includes(q) ||
        ev.ubicacion?.toLowerCase().includes(q) ||
        ev.descripcion?.toLowerCase().includes(q)
    );
  }, [allEvents, searchQuery]);

  // Botón actualizar: recarga del backend Y limpia la búsqueda
  const handleRefresh = async () => {
    if (onClearSearch) onClearSearch();
    await fetchEvents();
  };

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
          <h2>Eventos <span className="text-gradient">Disponibles</span>
            {searchQuery && (
              <span className="search-tag">
                "{searchQuery}"
                <button className="search-tag-clear" onClick={handleRefresh} title="Limpiar búsqueda">✕</button>
              </span>
            )}
          </h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {searchQuery && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {events.length} resultado{events.length !== 1 ? 's' : ''}
              </span>
            )}
            <button className="btn-secondary" onClick={handleRefresh}>Actualizar 🔄</button>
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
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
                {searchQuery
                  ? `No se encontraron eventos para "${searchQuery}".`
                  : 'No hay eventos disponibles aún.'}
              </div>
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
          console.log("Boleto comprado:", boleto);
        }}
      />
    </section>
  );
};

export default Events;