import React, { useState } from 'react';
import './Modal.css';

const EventModal = ({ isOpen, onClose, token, onEventAdded }) => {
  const [eventData, setEventData] = useState({
    nombre: '', descripcion: '', fecha: '', ubicacion: '', imagen_url: ''
  });
  
  const [zonas, setZonas] = useState([
    { id: 1, nombre: 'General', precio: 50, capacidad_total: 100 }
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAddZone = () => {
    setZonas([...zonas, { id: Date.now(), nombre: '', precio: 0, capacidad_total: 1 }]);
  };

  const handleRemoveZone = (id) => {
    if (zonas.length > 1) {
      setZonas(zonas.filter(z => z.id !== id));
    }
  };

  const handleZoneChange = (id, field, value) => {
    setZonas(zonas.map(z => z.id === id ? { ...z, [field]: value } : z));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...eventData,
        fecha: new Date(eventData.fecha).toISOString(),
        zonas: zonas.map(z => ({
          nombre: z.nombre,
          precio: Number(z.precio),
          capacidad_total: Number(z.capacidad_total)
        }))
      };

      // Si se ponen capacidades muy grandes, MySQL puede arrojar Internal Server Error (ER_TOO_MANY_PARAMETERS)
      // al crear miles de boletos de golpe en desarrollo.
      const totalCapacity = payload.zonas.reduce((acc, curr) => acc + curr.capacidad_total, 0);
      if (totalCapacity > 5000) {
        throw new Error('Para pruebas locales, mantén la capacidad total menor a 5000 para no saturar la base de datos.');
      }

      const res = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) {
        // En caso de Internal Server Error (500)
        throw new Error(data.message || 'Error interno del servidor. ¿Pusiste una capacidad muy grande?');
      }
      
      onEventAdded();
      onClose();
    } catch (err) {
      setError(Array.isArray(err.message) ? err.message[0] : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }} 
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <h3>Crear <span className="text-gradient">Nuevo Evento</span></h3>
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 74, 74, 0.1)', color: '#ff4a4a', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
            <div className="input-group" style={{flex: '1 1 200px'}}>
              <label>Nombre del Evento</label>
              <input required type="text" value={eventData.nombre} onChange={e => setEventData({...eventData, nombre: e.target.value})} />
            </div>
            <div className="input-group" style={{flex: '1 1 200px'}}>
              <label>Ubicación</label>
              <input required type="text" value={eventData.ubicacion} onChange={e => setEventData({...eventData, ubicacion: e.target.value})} />
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
            <div className="input-group" style={{flex: '1 1 200px'}}>
              <label>Fecha y Hora</label>
              <input required type="datetime-local" value={eventData.fecha} onChange={e => setEventData({...eventData, fecha: e.target.value})} />
            </div>
            <div className="input-group" style={{flex: '1 1 200px'}}>
              <label>URL Imagen (Opcional)</label>
              <input type="text" value={eventData.imagen_url} onChange={e => setEventData({...eventData, imagen_url: e.target.value})} />
            </div>
          </div>

          <div className="input-group">
            <label>Descripción</label>
            <input type="text" value={eventData.descripcion} onChange={e => setEventData({...eventData, descripcion: e.target.value})} />
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', marginTop: '10px', border: '1px solid var(--glass-border)' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h4 style={{color: 'var(--primary)', margin: 0}}>Configuración de Boletos (Zonas)</h4>
              <button type="button" onClick={handleAddZone} style={{background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem'}}>
                + Agregar Zona
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {zonas.map((z, index) => (
                <div key={z.id} style={{display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px'}}>
                  <div className="input-group" style={{flex: '2 1 120px'}}>
                    <label>Nombre Zona</label>
                    <input required type="text" value={z.nombre} onChange={e => handleZoneChange(z.id, 'nombre', e.target.value)} />
                  </div>
                  <div className="input-group" style={{flex: '1 1 80px'}}>
                    <label>Precio ($)</label>
                    <input required type="number" min="0" step="0.01" value={z.precio} onChange={e => handleZoneChange(z.id, 'precio', e.target.value)} />
                  </div>
                  <div className="input-group" style={{flex: '1 1 80px'}}>
                    <label>Capacidad</label>
                    <input required type="number" min="1" value={z.capacidad_total} onChange={e => handleZoneChange(z.id, 'capacidad_total', e.target.value)} />
                  </div>
                  {zonas.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveZone(z.id)} 
                      style={{background: 'rgba(255, 74, 74, 0.2)', color: '#ff4a4a', border: 'none', padding: '14px 12px', borderRadius: '12px', cursor: 'pointer'}}
                      title="Eliminar zona"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '20px'}}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{padding: '12px 24px'}}>Cancelar</button>
            <button type="submit" className="btn-primary" style={{padding: '12px 24px'}} disabled={loading}>
              {loading ? 'Creando...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
