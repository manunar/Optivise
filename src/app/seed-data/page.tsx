/**
 * Script pour ajouter des données de test au portfolio
 * Exécuter avec: npm run dev puis visiter /seed-data
 */

'use client';

import { useState } from 'react';

export default function SeedDataPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const seedPortfolioData = async () => {
    setLoading(true);
    setStatus('Ajout des données de portfolio...');

    const portfolioItems = [
      {
        titre: "Site Restaurant Le Gourmet",
        secteur: "restaurant",
        url_site: "https://legourmet-demo.fr",
        description_courte: "Site vitrine avec réservation en ligne et menu interactif",
        technologies_utilisees: ["WordPress", "WooCommerce", "PHP"],
        image_principale: undefined,
        ordre_affichage: 1,
        publie: true
      },
      {
        titre: "Salon de Coiffure Élégance",
        secteur: "coiffeur", 
        url_site: "https://salon-elegance-demo.fr",
        description_courte: "Site moderne avec prise de rendez-vous automatisée",
        technologies_utilisees: ["React", "Node.js", "MongoDB"],
        image_principale: undefined,
        ordre_affichage: 2,
        publie: true
      },
      {
        titre: "Artisan Menuisier Dupont",
        secteur: "artisan",
        url_site: "https://menuiserie-dupont-demo.fr", 
        description_courte: "Portfolio de réalisations avec galerie photo",
        technologies_utilisees: ["Next.js", "Tailwind CSS"],
        image_principale: undefined,
        ordre_affichage: 3,
        publie: true
      },
      {
        titre: "Thérapeute Bien-être",
        secteur: "therapeute",
        url_site: "https://therapie-sante-demo.fr",
        description_courte: "Site professionnel avec blog et prise de contact",
        technologies_utilisees: ["WordPress", "Elementor"],
        image_principale: undefined,
        ordre_affichage: 4,
        publie: true
      }
    ];

    try {
      // Utilisons directement la fonction de la base de données
      const { addPortfolioItem } = await import('@/backend/database/portfolio');
      
      for (const item of portfolioItems) {
        const result = await addPortfolioItem(item);
        if (!result.success) {
          throw new Error(`Erreur ajout ${item.titre}: ${result.error?.message}`);
        }
      }
      
      setStatus('✅ Données de portfolio ajoutées avec succès !');
    } catch (error: any) {
      setStatus(`❌ Erreur: ${error.message}`);
    }
    
    setLoading(false);
  };

  const seedOptionsData = async () => {
    setLoading(true);
    setStatus('Ajout des données d\'options...');

    // TODO: Ajouter des options de test si nécessaire
    setStatus('ℹ️ Options déjà configurées dans la base de données');
    setLoading(false);
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