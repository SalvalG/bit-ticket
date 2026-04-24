import React, { useState } from 'react';
import './AdminPanel.css';

const AdminPanel = ({ onEventAdded }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [authData, setAuthData] = useState({ email: '', password: '', nombre: '' });
  
  // Event form
  const [eventData, setEventData] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    ubicacion: '',
    imagen_url: ''
  });
  
  const [zonas, setZonas] = useState([
    { nombre: 'General', precio: 50, capacidad_total: 100 }
  ]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authData.email, password: authData.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
      
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      setSuccess('Sesión iniciada correctamente');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: authData.nombre || 'Admin Test',
          email: authData.email,
          password: authData.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al registrarse');
      
      setSuccess('Usuario registrado! Ahora inicia sesión.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        ...eventData,
        // Ensure date is properly formatted as ISO
        fecha: new Date(eventData.fecha).toISOString(),
        zonas: zonas.map(z => ({
          nombre: z.nombre,
          precio: Number(z.precio),
          capacidad_total: Number(z.capacidad_total)
        }))
      };

      const res = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear evento');
      
      setSuccess('Evento creado exitosamente!');
      setEventData({ nombre: '', descripcion: '', fecha: '', ubicacion: '', imagen_url: '' });
      if (onEventAdded) onEventAdded();
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <section className="admin-panel-section" id="admin">
      <div className="admin-container">
        <div className="admin-header">
          <h2>Panel de <span className="text-gradient">Pruebas (Admin)</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Integra Frontend y Backend</p>
        </div>

        {error && <div className="error-msg">{Array.isArray(error) ? error.join(', ') : error}</div>}
        {success && <div className="success-msg">{success}</div>}

        {!token ? (
          <form className="admin-form">
            <p>Para crear eventos, necesitas una cuenta con rol de ADMIN (email debe contener "admin")</p>
            <div className="form-group">
              <label>Nombre (solo registro)</label>
              <input type="text" className="admin-input" placeholder="Ej. Juan Admin" value={authData.nombre} onChange={e => setAuthData({...authData, nombre: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="admin-input" placeholder="admin@ejemplo.com" value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" className="admin-input" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} />
            </div>
            <div className="admin-actions">
              <button className="btn-secondary" onClick={handleRegister}>Registrar</button>
              <button className="btn-primary" onClick={handleLogin}>Iniciar Sesión</button>
            </div>
          </form>
        ) : (
          <form className="admin-form" onSubmit={handleCreateEvent}>
            <div className="form-row">
              <div className="form-group">
                <label>Nombre del Evento</label>
                <input required type="text" className="admin-input" value={eventData.nombre} onChange={e => setEventData({...eventData, nombre: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Ubicación</label>
                <input required type="text" className="admin-input" value={eventData.ubicacion} onChange={e => setEventData({...eventData, ubicacion: e.target.value})} />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Fecha y Hora</label>
                <input required type="datetime-local" className="admin-input" value={eventData.fecha} onChange={e => setEventData({...eventData, fecha: e.target.value})} />
              </div>
              <div className="form-group">
                <label>URL Imagen (Opcional)</label>
                <input type="text" className="admin-input" placeholder="https://..." value={eventData.imagen_url} onChange={e => setEventData({...eventData, imagen_url: e.target.value})} />
              </div>
            </div>

            <div className="form-group">
              <label>Descripción</label>
              <textarea className="admin-input" rows="2" value={eventData.descripcion} onChange={e => setEventData({...eventData, descripcion: e.target.value})}></textarea>
            </div>

            <div className="zone-container">
              <div className="zone-header">Zona de Boletos</div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de Zona</label>
                  <input required type="text" className="admin-input" value={zonas[0].nombre} onChange={e => setZonas([{...zonas[0], nombre: e.target.value}])} />
                </div>
                <div className="form-group">
                  <label>Precio ($)</label>
                  <input required type="number" className="admin-input" value={zonas[0].precio} onChange={e => setZonas([{...zonas[0], precio: e.target.value}])} />
                </div>
                <div className="form-group">
                  <label>Capacidad</label>
                  <input required type="number" className="admin-input" value={zonas[0].capacidad_total} onChange={e => setZonas([{...zonas[0], capacidad_total: e.target.value}])} />
                </div>
              </div>
            </div>

            <div className="admin-actions">
              <button type="button" className="btn-danger" onClick={logout}>Cerrar Sesión</button>
              <button type="submit" className="btn-primary">Crear Evento</button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default AdminPanel;
