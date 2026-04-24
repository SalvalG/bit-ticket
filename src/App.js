import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import AuthModal from './components/AuthModal';
import MyEventsModal from './components/MyEventsModal';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMyEventsModalOpen, setIsMyEventsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLoginSuccess = (userData, tokenStr) => {
    localStorage.setItem('token', tokenStr);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(tokenStr);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <div className="App">
      <Navbar 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)} 
        onLogout={handleLogout} 
        onMyEventsClick={() => setIsMyEventsModalOpen(true)}
      />
      <Hero
        onSearch={(q) => setSearchQuery(q)}
        searchQuery={searchQuery}
      />
      <Events 
        user={user} 
        token={token} 
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
        onRequireLogin={() => setIsAuthModalOpen(true)} 
      />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      <MyEventsModal
        isOpen={isMyEventsModalOpen}
        onClose={() => setIsMyEventsModalOpen(false)}
        token={token}
      />
    </div>
  );
}

export default App;