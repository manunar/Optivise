/**
 * Page de test des API
 * URL: http://localhost:3001/test-api
 */

'use client';

import { useState } from 'react';

export default function TestApiPage() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [optionsData, setOptionsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testPortfolioAPI = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setPortfolioData(data);
    } catch (err: any) {
      setError(`Erreur portfolio: ${err.message}`);
    }
    setLoading(false);
  };

  const testOptionsAPI = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/options');
      const data = await response.json();
      setOptionsData(data);
    } catch (err: any) {
      setError(`Erreur options: ${err.message}`);
    }
    setLoading(false);
  };

  const testSecteursAPI = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/portfolio?action=secteurs');
      const data = await response.json();
      console.log('Secteurs:', data);
      alert(`Secteurs: ${JSON.stringify(data, null, 2)}`);
    } catch (err: any) {
      setError(`Erreur secteurs: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 Test des API WebCraft</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Actions de test</h2>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            onClick={testPortfolioAPI}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Test API Portfolio
          </button>
          <button 
            onClick={testOptionsAPI}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Test API Options
          </button>
          <button 
            onClick={testSecteursAPI}
            disabled={loading}
            style={{ padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Test API Secteurs
          </button>
        </div>
        
        {loading && <p>⏳ Chargement...</p>}
        {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <h3>📁 Données Portfolio</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
            {portfolioData ? JSON.stringify(portfolioData, null, 2) : 'Pas encore de données'}
          </pre>
        </div>
        
        <div>
          <h3>⚙️ Données Options</h3>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
            {optionsData ? JSON.stringify(optionsData, null, 2) : 'Pas encore de données'}
          </pre>
        </div>
      </div>
    </div>
  );
}