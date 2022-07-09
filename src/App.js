import React from 'react';
import './style.css';
import Cards from './Cards';

export default function App() {
  return (
    <div className="app-wrapper">
      <h1>Card Memory Game</h1>
      <Cards />
    </div>
  );
}
