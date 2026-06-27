import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importation de ton composant principal
import './App.css';     // Importation de tes styles globaux

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);