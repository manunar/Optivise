/**
 * API Route: /api/portfolio
 * Gestion publique du portfolio - Lecture seule
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPublicPortfolio, getPortfolioBySecteur, getPortfolioSecteurs } from '@/backend/database/portfolio';

/**
 * GET /api/portfolio
 * Récupérer les éléments du portfolio public
 * Query params: secteur (optionnel)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secteur = searchParams.get('secteur');
    
    // Si demande des secteurs disponibles
    if (searchParams.get('action') === 'secteurs') {
      const secteursResult = await getPortfolioSecteurs();
      
      if (!secteursResult.success) {
        return NextResponse.json(
          { error: 'Erreur lors de la récupération des secteurs' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        data: secteursResult.data 
      });
    }
    
    // Récupérer les éléments du portfolio
    const portfolioResult = secteur 
      ? await getPortfolioBySecteur(secteur)
      : await getPublicPortfolio();
    
    if (!portfolioResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du portfolio' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: portfolioResult.data 
    });
    
  } catch (error) {
    console.error('Erreur API portfolio:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}