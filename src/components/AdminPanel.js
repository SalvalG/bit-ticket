import React, { useState, useEffect, useCallback, useRef } from 'react';
import './AdminPanel.css';

const API = 'http://localhost:3001/api';

const emptyEvent = {
  nombre: '',
  descripcion: '',
  fecha: '',
  ubicacion: '',
  imagen_url: '',
};

const emptyZona = { nombre: 'General', precio: 50, capacidad_total: 100 };

const AdminPanel = ({ onEventAdded }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auth
  const [authData, setAuthData] = useState({ email: '', password: '', nombre: '' });

  // Vista activa: 'list' | 'create' | 'edit'
  const [view, setView] = useState('list');

  // Lista de eventos
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Formulario de evento (como ref para evitar re-mounts del form)
  const [eventData, setEventData] = useState(emptyEvent);
  const [zonas, setZonas] = useState([{ ...emptyZona }]);
  const [editingId, setEditingId] = useState(null);

  // Modal de confirmación de eliminación
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── helpers ──────────────────────────────────────────────────────────
  const notify = useCallback((msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(''); }
    else { setSuccess(msg); setError(''); }
    setTimeout(() => { setError(''); setSuccess(''); }, 4000);
  }, []);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }), [token]);

  // ── cargar eventos ───────────────────────────────────────────────────
  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch(`${API}/events`);
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch {
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadEvents();
  }, [token, loadEvents]);

  // ── auth ─────────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authData.email, password: authData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al iniciar sesión');
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      notify('Sesión iniciada correctamente');
    } catch (err) {
      notify(err.message, true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: authData.nombre || 'Admin', email: authData.email, password: authData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al registrarse');
      notify('Usuario registrado. Ahora inicia sesión.');
    } catch (err) {
      notify(err.message, true);
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
    setView('list');
    setEvents([]);
  };

  // ── zona helpers ──────────────────────────────────────────────────────
  const addZona = () => setZonas(prev => [...prev, { nombre: '', precio: 0, capacidad_total: 0 }]);
  const removeZona = (i) => setZonas(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);
  const updateZona = (i, field, val) =>
    setZonas(prev => prev.map((z, idx) => (idx === i ? { ...z, [field]: val } : z)));

  // ── crear evento ──────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...eventData,
        fecha: new Date(eventData.fecha).toISOString(),
        zonas: zonas.map((z) => ({
          nombre: z.nombre,
          precio: Number(z.precio),
          capacidad_total: Number(z.capacidad_total),
        })),
      };
      const res = await fetch(`${API}/events`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear evento');
      notify('¡Evento creado exitosamente!');
      setEventData(emptyEvent);
      setZonas([{ ...emptyZona }]);
      setView('list');
      loadEvents();
      if (onEventAdded) onEventAdded();
    } catch (err) {
      notify(err.message, true);
    }
  };

  // ── editar evento ─────────────────────────────────────────────────────
  const openEdit = (ev) => {
    // Ajustar la fecha al formato datetime-local (YYYY-MM-DDTHH:mm)
    const localFecha = ev.fecha
      ? new Date(ev.fecha).toISOString().slice(0, 16)
      : '';
    setEventData({
      nombre: ev.nombre || '',
      descripcion: ev.descripcion || '',
      fecha: localFecha,
      ubicacion: ev.ubicacion || '',
      imagen_url: ev.imagen_url || '',
    });
    setZonas(
      ev.zonas && ev.zonas.length
        ? ev.zonas.map((z) => ({ nombre: z.nombre, precio: z.precio, capacidad_total: z.capacidad_total }))
        : [{ ...emptyZona }]
    );
    setEditingId(ev.id);
    // Cambiamos la vista DESPUÉS de haber seteado los datos
    setView('edit');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...eventData,
        fecha: new Date(eventData.fecha).toISOString(),
      };
      const res = await fetch(`${API}/events/${editingId}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al actualizar');
      notify('Evento actualizado correctamente');
      setEditingId(null);
      setView('list');
      loadEvents();
      if (onEventAdded) onEventAdded();
    } catch (err) {
      notify(err.message, true);
    }
  };

  // ── eliminar evento ───────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API}/events/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al eliminar');
      notify(data.message || 'Evento eliminado');
      setDeleteTarget(null);
      loadEvents();
      if (onEventAdded) onEventAdded();
    } catch (err) {
      notify(err.message, true);
      setDeleteTarget(null);
    }
  };

  // ── helpers de formato ────────────────────────────────────────────────
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

  // ── render principal ──────────────────────────────────────────────────
  return (
    <section className="admin-panel-section" id="admin">
      <div className="admin-container-wide">
        <div className="admin-header">
          <h2>Panel de <span className="text-gradient">Administración</span></h2>
          <p style={{ color: 'var(--text-muted)' }}>Gestión de Eventos</p>
        </div>

        {error && <div className="error-msg">{Array.isArray(error) ? error.join(', ') : error}</div>}
        {success && <div className="success-msg">{success}</div>}

        {/* ── Sin token: formulario de auth ── */}
        {!token ? (
          <form className="admin-form admin-form-centered">
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
              Inicia sesión con una cuenta con rol <strong>ADMIN</strong> (email debe contener "admin")
            </p>
            <div className="form-group">
              <label>Nombre (solo registro)</label>
              <input type="text" className="admin-input" placeholder="Ej. Juan Admin"
                value={authData.nombre} onChange={(e) => setAuthData({ ...authData, nombre: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" className="admin-input" placeholder="admin@ejemplo.com"
                value={authData.email} onChange={(e) => setAuthData({ ...authData, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" className="admin-input"
                value={authData.password} onChange={(e) => setAuthData({ ...authData, password: e.target.value })} />
            </div>
            <div className="admin-actions">
              <button className="btn-secondary" onClick={handleRegister}>Registrar</button>
              <button className="btn-primary" onClick={handleLogin}>Iniciar Sesión</button>
            </div>
          </form>
        ) : (
          <>
            {/* ── Barra de acciones ── */}
            <div className="admin-topbar">
              <div className="admin-tabs">
                <button
                  className={`tab-btn ${view === 'list' ? 'active' : ''}`}
                  onClick={() => setView('list')}
                >
                  📋 Eventos
                </button>
                <button
                  className={`tab-btn ${view === 'create' ? 'active' : ''}`}
                  onClick={() => {
                    setEventData({ ...emptyEvent });
                    setZonas([{ ...emptyZona }]);
                    setEditingId(null);
                    setView('create');
                  }}
                >
                  ➕ Crear Evento
                </button>
              </div>
              <button className="btn-danger-sm" onClick={logout}>Cerrar Sesión</button>
            </div>

            {/* ── Vista: Lista de eventos ── */}
            {view === 'list' && (
              <div className="events-list">
                {loadingEvents ? (
                  <div className="loading-state">Cargando eventos...</div>
                ) : events.length === 0 ? (
                  <div className="empty-state">
                    <span className="empty-icon">🎭</span>
                    <p>No hay eventos registrados.</p>
                    <button className="btn-primary" onClick={() => setView('create')}>Crear primer evento</button>
                  </div>
                ) : (
                  <div className="events-table-wrap">
                    <table className="events-table">
                      <thead>
                        <tr>
                          <th>Evento</th>
                          <th>Fecha</th>
                          <th>Ubicación</th>
                          <th>Zonas</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((ev) => (
                          <tr key={ev.id}>
                            <td>
                              <div className="event-cell-name">{ev.nombre}</div>
                              <div className="event-cell-desc">{ev.descripcion?.slice(0, 40)}{ev.descripcion?.length > 40 ? '…' : ''}</div>
                            </td>
                            <td>{formatDate(ev.fecha)}</td>
                            <td>{ev.ubicacion}</td>
                            <td>
                              {ev.zonas?.map((z) => (
                                <span key={z.id} className="zona-badge">{z.nombre} ${z.precio}</span>
                              ))}
                            </td>
                            <td>
                              <span className={`status-badge status-${ev.estado?.toLowerCase()}`}>
                                {ev.estado}
                              </span>
                            </td>
                            <td>
                              <div className="action-btns">
                                <button className="btn-edit" onClick={() => openEdit(ev)} title="Editar">✏️</button>
                                <button className="btn-del" onClick={() => setDeleteTarget(ev)} title="Eliminar">🗑️</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── Vista: Crear evento ── */}
            {view === 'create' && (
              <div className="form-section">
                <h3 className="section-title">Crear Nuevo Evento</h3>
                <form className="admin-form" onSubmit={handleCreate}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre del Evento</label>
                      <input required type="text" className="admin-input"
                        value={eventData.nombre}
                        onChange={(e) => setEventData(prev => ({ ...prev, nombre: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Ubicación</label>
                      <input required type="text" className="admin-input"
                        value={eventData.ubicacion}
                        onChange={(e) => setEventData(prev => ({ ...prev, ubicacion: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha y Hora</label>
                      <input required type="datetime-local" className="admin-input"
                        value={eventData.fecha}
                        onChange={(e) => setEventData(prev => ({ ...prev, fecha: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>URL Imagen (Opcional)</label>
                      <input type="text" className="admin-input" placeholder="https://..."
                        value={eventData.imagen_url}
                        onChange={(e) => setEventData(prev => ({ ...prev, imagen_url: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea className="admin-input" rows="2"
                      value={eventData.descripcion}
                      onChange={(e) => setEventData(prev => ({ ...prev, descripcion: e.target.value }))} />
                  </div>

                  {/* Zonas */}
                  <div className="zone-section">
                    <div className="zone-section-header">
                      <span>Zonas de Boletos</span>
                      <button type="button" className="btn-add-zone" onClick={addZona}>+ Agregar Zona</button>
                    </div>
                    {zonas.map((z, i) => (
                      <div key={i} className="zone-container">
                        <div className="zone-header">
                          Zona {i + 1}
                          {zonas.length > 1 && (
                            <button type="button" className="btn-remove-zone" onClick={() => removeZona(i)}>✕</button>
                          )}
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Nombre</label>
                            <input required type="text" className="admin-input" value={z.nombre}
                              onChange={(e) => updateZona(i, 'nombre', e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>Precio ($)</label>
                            <input required type="number" min="0" className="admin-input" value={z.precio}
                              onChange={(e) => updateZona(i, 'precio', e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label>Capacidad</label>
                            <input required type="number" min="1" className="admin-input" value={z.capacidad_total}
                              onChange={(e) => updateZona(i, 'capacidad_total', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="admin-actions">
                    <button type="button" className="btn-secondary" onClick={() => setView('list')}>Cancelar</button>
                    <button type="submit" className="btn-primary">Crear Evento</button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Vista: Editar evento ── */}
            {view === 'edit' && (
              <div className="form-section">
                <h3 className="section-title">Editar Evento</h3>
                <form className="admin-form" onSubmit={handleUpdate}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre del Evento</label>
                      <input required type="text" className="admin-input"
                        value={eventData.nombre}
                        onChange={(e) => setEventData(prev => ({ ...prev, nombre: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Ubicación</label>
                      <input required type="text" className="admin-input"
                        value={eventData.ubicacion}
                        onChange={(e) => setEventData(prev => ({ ...prev, ubicacion: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha y Hora</label>
                      <input required type="datetime-local" className="admin-input"
                        value={eventData.fecha}
                        onChange={(e) => setEventData(prev => ({ ...prev, fecha: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>URL Imagen (Opcional)</label>
                      <input type="text" className="admin-input" placeholder="https://..."
                        value={eventData.imagen_url}
                        onChange={(e) => setEventData(prev => ({ ...prev, imagen_url: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea className="admin-input" rows="2"
                      value={eventData.descripcion}
                      onChange={(e) => setEventData(prev => ({ ...prev, descripcion: e.target.value }))} />
                  </div>

                  {/* Info de zonas (solo lectura en edición) */}
                  {zonas.length > 0 && (
                    <div className="zone-section">
                      <div className="zone-section-header">
                        <span>Zonas actuales</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          (Las zonas no se modifican al editar)
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {zonas.map((z, i) => (
                          <span key={i} className="zona-badge">
                            {z.nombre} — ${z.precio} — Cap: {z.capacidad_total}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="admin-actions">
                    <button type="button" className="btn-secondary" onClick={() => { setView('list'); setEditingId(null); }}>Cancelar</button>
                    <button type="submit" className="btn-primary">Guardar Cambios</button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal de confirmación de eliminación ── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h3>¿Eliminar evento?</h3>
            <p>Se eliminará permanentemente <strong>"{deleteTarget.nombre}"</strong> junto con todas sus zonas y boletos.</p>
            <p className="confirm-warning">Esta acción no se puede deshacer.</p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Cancelar</button>
              <button className="btn-danger" onClick={confirmDelete}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminPanel;
