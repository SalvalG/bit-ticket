import React, { useState, useEffect } from 'react';
import './Modal.css';

const MyEventsModal = ({ isOpen, onClose, token }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && token) {
      fetchHistory();
    }
  }, [isOpen, token]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/orders/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al obtener el historial');
      const data = await res.json();
      setHistory(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async (boletoId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/tickets/${boletoId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al descargar boleto');
      
      const boletoInfo = `
      =============================
              BOLETO DIGITAL       
      =============================
      Evento: ${data.evento.nombre}
      Fecha: ${new Date(data.evento.fecha).toLocaleString()}
      Ubicación: ${data.evento.ubicacion}
      -----------------------------
      Zona: ${data.zona.nombre}
      Precio: $${data.zona.precio}
      -----------------------------
      ID: ${data.id}
      =============================
      ¡Guarda este comprobante!`;
      
      alert(boletoInfo);
    } catch (err) {
      alert("Error al descargar: " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto'}} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-header" style={{marginBottom: '20px'}}>
          <h3>Mis <span className="text-gradient">Próximos Eventos</span></h3>
        </div>

        {error && <div style={{ color: '#ff4a4a', marginBottom: '20px', background: 'rgba(255, 74, 74, 0.1)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Cargando eventos...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>No tienes eventos próximos o compras previas.</div>
            ) : (
              history.map(order => (
                <div key={order.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Orden: {order.id.substring(0,8)}</span>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{order.estado}</span>
                  </div>
                  {order.boletos && order.boletos.length > 0 ? order.boletos.map(boleto => (
                    <div key={boleto.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', color: 'white' }}>{boleto.evento?.nombre || 'Evento Desconocido'}</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                          {boleto.evento?.fecha ? new Date(boleto.evento.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''} 
                          <br />
                          📍 {boleto.evento?.ubicacion || 'Ubicación no disponible'}
                          <br />
                          🎟️ {boleto.zona?.nombre} - ${boleto.zona?.precio}
                        </div>
                      </div>
                      {boleto.estado === 'VENDIDO' ? (
                        <button className="btn-secondary small-btn" onClick={() => handleDownloadTicket(boleto.id)}>
                          Descargar Boleto
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{boleto.estado}</span>
                      )}
                    </div>
                  )) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No hay boletos en esta orden.</div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsModal;
