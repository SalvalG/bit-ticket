import React, { useState } from 'react';
import './Modal.css';

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin 
      ? { email: formData.email, password: formData.password }
      : { nombre: formData.nombre || 'Usuario Nuevo', email: formData.email, password: formData.password };

    try {
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ocurrió un error');
      
      if (isLogin) {
        onLoginSuccess(data.user, data.access_token);
        onClose();
      } else {
        // Automatically switch to login after register
        setIsLogin(true);
        setError('¡Registro exitoso! Por favor inicia sesión.');
      }
    } catch (err) {
      setError(Array.isArray(err.message) ? err.message[0] : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <h3>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h3>
        </div>

        {error && (
          <div style={{
            background: error.includes('exitoso') ? 'rgba(74, 255, 143, 0.1)' : 'rgba(255, 74, 74, 0.1)',
            color: error.includes('exitoso') ? '#4aff8f' : '#ff4a4a',
            padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form className="modal-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Nombre Completo</label>
              <input 
                type="text" 
                placeholder="Ej. Juan Pérez"
                value={formData.nombre} 
                onChange={e => setFormData({...formData, nombre: e.target.value})} 
              />
            </div>
          )}
          <div className="input-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              required
              placeholder="correo@ejemplo.com"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          
          <button type="submit" className="btn-primary modal-btn" disabled={loading}>
            {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarse')}
          </button>
        </form>

        <div className="modal-switch">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
