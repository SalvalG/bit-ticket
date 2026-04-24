import React, { useState } from 'react';
import './Modal.css';

const CheckoutModal = ({ isOpen, onClose, token, user, event, onPurchaseSuccess, onRequireLogin }) => {
  const [step, setStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Card details (dummy)
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  if (!isOpen || !event) return null;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      onRequireLogin();
      return;
    }
    
    if (!selectedZone) {
      setError('Por favor selecciona una zona.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/orders/checkout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          evento_id: event.id,
          boletos: [{ zona_id: selectedZone, cantidad: 1 }]
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al reservar boleto');
      
      setOrder(data.orden);
      setStep(2);
    } catch (err) {
      setError(Array.isArray(err.message) ? err.message[0] : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!card.number || !card.cvv) {
      setError('Por favor completa los datos de la tarjeta.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/orders/confirm', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orden_id: order.id,
          metodo_pago: 'TARJETA_CREDITO',
          transaccion_id: `txn_${Date.now()}`
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al procesar el pago');
      
      setOrder({...order, boletosComprados: data.boletos});
      setStep(3);
      if (onPurchaseSuccess) onPurchaseSuccess(data.boletos[0]);
    } catch (err) {
      setError(Array.isArray(err.message) ? err.message[0] : err.message);
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
      
      // Simular descarga de un PDF mostrando una alerta con los datos del JSON
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{maxWidth: '500px'}} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-header" style={{marginBottom: '20px'}}>
          <h3>{step === 3 ? '¡Compra Exitosa!' : 'Proceso de Compra'}</h3>
          {step < 3 && <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>{event.nombre}</p>}
        </div>

        {error && (
          <div style={{ background: 'rgba(255, 74, 74, 0.1)', color: '#ff4a4a', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <form className="modal-form" onSubmit={handleCheckout}>
            <div className="input-group">
              <label>Selecciona tu Zona</label>
              <select 
                className="admin-input" 
                style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)' }}
                value={selectedZone} 
                onChange={e => setSelectedZone(e.target.value)}
              >
                <option value="" style={{color: 'black'}}>-- Elige una opción --</option>
                {event.zonas && event.zonas.map(z => (
                  <option key={z.id} value={z.id} style={{color: 'black'}} disabled={z.asientos_disponibles <= 0}>
                    {z.nombre} - ${z.precio} {z.asientos_disponibles !== undefined ? `(Disponibles: ${z.asientos_disponibles})` : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="btn-primary modal-btn" disabled={loading} style={{marginTop: '20px'}}>
              {loading ? 'Reservando...' : 'Continuar al Pago'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="modal-form" onSubmit={handleConfirm}>
            <div style={{background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center'}}>
              <p style={{margin: 0, color: 'var(--text-muted)'}}>Total a pagar:</p>
              <h2 style={{margin: '8px 0 0 0', color: 'var(--primary)'}}>${order?.monto_total}</h2>
            </div>

            <div className="input-group">
              <label>Nombre en la tarjeta</label>
              <input required type="text" placeholder="Ej. Juan Pérez" value={card.name} onChange={e => setCard({...card, name: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Número de Tarjeta</label>
              <input 
                required 
                type="text" 
                placeholder="0000 0000 0000 0000" 
                maxLength="19" 
                value={card.number} 
                onChange={e => {
                  let val = e.target.value.replace(/\D/g, '');
                  val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                  setCard({...card, number: val});
                }} 
              />
            </div>
            <div style={{display: 'flex', gap: '16px'}}>
              <div className="input-group" style={{flex: 1}}>
                <label>Vencimiento</label>
                <input 
                  required 
                  type="text" 
                  placeholder="MM/YY" 
                  maxLength="5" 
                  value={card.expiry} 
                  onChange={e => {
                    let val = e.target.value.replace(/\D/g, '');
                    if (val.length >= 3) {
                      val = val.slice(0, 2) + '/' + val.slice(2, 4);
                    }
                    setCard({...card, expiry: val});
                  }} 
                />
              </div>
              <div className="input-group" style={{flex: 1}}>
                <label>CVV</label>
                <input 
                  required 
                  type="password" 
                  placeholder="123" 
                  maxLength="4" 
                  value={card.cvv} 
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '');
                    setCard({...card, cvv: val});
                  }} 
                />
              </div>
            </div>
            
            <button type="submit" className="btn-primary modal-btn" disabled={loading} style={{marginTop: '20px'}}>
              {loading ? 'Procesando Pago...' : 'Confirmar y Pagar'}
            </button>
          </form>
        )}

        {step === 3 && (
          <div style={{textAlign: 'center', padding: '20px 0'}}>
            <div style={{fontSize: '4rem', marginBottom: '16px'}}>🎉</div>
            <p style={{marginBottom: '24px', color: 'var(--text-light)'}}>
              Tu pago ha sido procesado exitosamente. Ya puedes descargar tu boleto digital.
            </p>
            {order?.boletosComprados?.map(b => (
              <button 
                key={b.id} 
                className="btn-primary modal-btn" 
                style={{marginBottom: '12px'}}
                onClick={() => handleDownloadTicket(b.id)}
              >
                📥 Descargar Boleto
              </button>
            ))}
            <button className="btn-secondary modal-btn" onClick={onClose} style={{marginTop: '8px'}}>Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
