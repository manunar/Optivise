/**
 * API Route: /api/options
 * Gestion des options du configurateur
 */

import { NextRequest, NextResponse } from 'next/server';
import { getActiveOptions } from '@/backend/database/options';
import { checkRateLimit } from '@/utils/rateLimit';

// Cache simple en mémoire (pour éviter les requêtes répétées)
let optionsCache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * GET /api/options
 * Récupérer les options actives du configurateur
 * Query params: type (optionnel), secteur (optionnel)
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting : 30 requêtes par minute par IP
    const { allowed, ip } = checkRateLimit(request, 30, 60 * 1000);
    if (!allowed) {
      console.log(`Rate limit dépassé pour /api/options IP: ${ip}`);
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez patienter.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const secteur = searchParams.get('secteur');
    
    // Vérifier le cache si pas de filtres spécifiques
    if (!type && !secteur && optionsCache) {
      const now = Date.now();
      if (now - optionsCache.timestamp < CACHE_DURATION) {
        console.log('Cache hit pour /api/options');
        return NextResponse.json({ 
          success: true, 
          data: optionsCache.data 
        });
      }
    }
    
    const result = await getActiveOptions();
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des options' },
        { status: 500 }
      );
    }
    
    // Mettre en cache si pas de filtres
    if (!type && !secteur) {
      optionsCache = {
        data: result.data,
        timestamp: Date.now()
      };
      console.log('Options mises en cache');
    }
    
    return NextResponse.json({ 
      success: true, 
      data: result.data 
    });
    
  } catch (error) {
    console.error('Erreur API options:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}