/**
 * API Route: /api/configurateur/calculate
 * Calcul des prix et validation de configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { calculateConfigurationPrice, getActiveOptions } from '@/backend/database/options';
import { ConfigurationCompleteSchema } from '@/backend/validations/configurateur';

/**
 * POST /api/configurateur/calculate
 * Calculer le prix d'une configuration
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données
    const validation = ConfigurationCompleteSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format()
        },
        { status: 400 }
      );
    }
    
    const { options_selectionnees } = validation.data;
    
    // Récupérer toutes les options pour le calcul
    const optionsResult = await getActiveOptions();
    if (!optionsResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des options' },
        { status: 500 }
      );
    }
    
    // Calcul du prix
    const result = calculateConfigurationPrice(optionsResult.data || [], options_selectionnees);
    
    return NextResponse.json({ 
      success: true, 
      data: result 
    });
    
  } catch (error) {
    console.error('Erreur API calcul configurateur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}