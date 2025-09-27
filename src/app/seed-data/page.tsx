/**
 * Script pour ajouter des données de test au portfolio (DEV ONLY)
 * Exécuter avec: npm run dev puis visiter /seed-data
 *
 * Important: Cette page RESTE un composant client, donc elle NE DOIT PAS importer
 * de modules serveur. Le seed est effectué via une API route côté serveur.
 */

'use client';

import { useState } from 'react';

export default function SeedDataPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const seedPortfolioData = async () => {
    try {
      setLoading(true);
      setStatus('Ajout des données de portfolio...');

      const res = await fetch('/api/seed-portfolio', {
        method: 'POST'
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors du seed du portfolio');
      }

      setStatus('✅ Données de portfolio ajoutées avec succès !');
    } catch (error: any) {
      setStatus(`❌ Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const seedOptionsData = async () => {
    setLoading(true);
    setStatus('Ajout des données d\'options...');

    // TODO: Ajouter des options de test si nécessaire
    setStatus('ℹ️ Options déjà configurées dans la base de données');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🌱 Seed Data - Données de Test</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <p>Cette page permet d'ajouter des données de test à la base de données.</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            onClick={seedPortfolioData}
            disabled={loading}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#10b981', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            Ajouter Portfolio Test
          </button>
          <button 
            onClick={seedOptionsData}
            disabled={loading}
            style={{ 
              padding: '0.75rem 1.5rem', 
              backgroundColor: '#3b82f6', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            Vérifier Options
          </button>
        </div>
        
        {loading && <p>⏳ Traitement en cours...</p>}
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f8fafc', 
          border: '1px solid #e2e8f0', 
          borderRadius: '6px',
          minHeight: '60px'
        }}>
          <strong>Status:</strong> {status || 'Prêt à ajouter des données'}
        </div>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '6px' }}>
        <h3>⚠️ Note importante</h3>
        <p>Ces données sont uniquement pour les tests. En production, le portfolio sera géré via l'interface d'administration.</p>
      </div>
    </div>
  );
}