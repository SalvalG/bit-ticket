import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Events from './components/Events';
import './App.css';

function App() {
  const username = "Usuario"; // Más adelante se puede tomar desde la BD o login

  return (
    <div className="App">
      <Navbar />
      <Header username={username} />
      <Events />
    </div>
  );
}

export default App;