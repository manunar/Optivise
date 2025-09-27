import { NextRequest, NextResponse } from 'next/server';
import { addPortfolioItem } from '@/backend/database/portfolio';

export async function POST(_req: NextRequest) {
  try {
    // Désactiver en production par sécurité
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { success: false, error: 'Seed désactivé en production' },
        { status: 403 }
      );
    }

    // Données de démonstration pour le seed (DEV ONLY)
    const portfolioItems = [
      {
        titre: 'Site Restaurant Le Gourmet',
        secteur: 'restaurant',
        url_site: 'https://legourmet-demo.fr',
        description_courte: 'Site vitrine avec réservation en ligne et menu interactif',
        technologies_utilisees: ['WordPress', 'WooCommerce', 'PHP'],
        image_principale: undefined,
        ordre_affichage: 1,
      },
      {
        titre: 'Salon de Coiffure Élégance',
        secteur: 'coiffeur',
        url_site: 'https://salon-elegance-demo.fr',
        description_courte: 'Site moderne avec prise de rendez-vous automatisée',
        technologies_utilisees: ['React', 'Node.js', 'MongoDB'],
        image_principale: undefined,
        ordre_affichage: 2,
      },
      {
        titre: 'Artisan Menuisier Dupont',
        secteur: 'artisan',
        url_site: 'https://menuiserie-dupont-demo.fr',
        description_courte: 'Portfolio de réalisations avec galerie photo',
        technologies_utilisees: ['Next.js', 'Tailwind CSS'],
        image_principale: undefined,
        ordre_affichage: 3,
      },
      {
        titre: 'Thérapeute Bien-être',
        secteur: 'therapeute',
        url_site: 'https://therapie-sante-demo.fr',
        description_courte: 'Site professionnel avec blog et prise de contact',
        technologies_utilisees: ['WordPress', 'Elementor'],
        image_principale: undefined,
        ordre_affichage: 4,
      },
    ];

    for (const item of portfolioItems) {
      const result = await addPortfolioItem(item);
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error?.message || 'Erreur seed portfolio' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erreur seed-portfolio:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
